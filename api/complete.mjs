import { http } from "@ampt/sdk";
import { data } from "@ampt/data";
import express, { Router } from "express";
import asyncHandler from "express-async-handler";

const api = express();

const router = Router();

router.get(
  "/healthcheck",
  asyncHandler(async (_req, res) => {
    res.json({ status: "ok" });
  })
);

const todos = Router({ mergeParams: true });

router.use("/todos", todos);

todos.get(
  "/",
  asyncHandler(async (_req, res) => {
    const result = await data.get("todo:*");
    const items = result.items.map((item) => item.value);
    res.json({ items });
  })
);

todos.post(
  "/",
  asyncHandler(async (req, res) => {
    const id = Date.now();
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: "name is required" });
      return;
    }

    await data.set(`todo:${id}`, { id, name, status: "incomplete" });
    res.sendStatus(201);
  })
);

todos.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const todo = await data.get(`todo:${id}`);

    if (!todo) {
      res.sendStatus(404);
      return;
    }

    await data.set(`todo:${id}`, {
      ...todo,
      status: todo.status === "complete" ? "incomplete" : "complete",
    });

    res.json({
      message: `Todo ${todo.name} updated`,
    });
  })
);

todos.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const todo = await data.get(`todo:${id}`);

    if (!todo) {
      res.sendStatus(404);
      return;
    }

    res.json({ todo });
  })
);

api.use(express.json());
api.use("/api", router);

api.use(async (req, res) => {
  if (req.accepts("html")) {
    // Single-page-app support: return index.html for all other HTML requests
    // this returns the app for any path that does not have a defined route
    const stream = await http.node.readStaticFile("index.html");
    res.status(200).type("html");
    stream?.pipe(res);
  } else if (req.accepts("json")) {
    res.status(404).json({ message: "Not found" });
  } else if (req.accepts("txt")) {
    res.status(404).type("txt").send("Not found");
  } else {
    res.status(404).end();
  }
});

http.node.use(api);
