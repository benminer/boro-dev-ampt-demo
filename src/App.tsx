import { useCallback, useState } from "react";
import { useTodos } from "./hooks/useTodos";
import { CheckCircle, Circle } from "react-feather";
import { apiClient } from "./utility/api";

function App() {
  const [name, setName] = useState("");
  const { todos = [], refresh: refreshTodos, loading } = useTodos();

  const submitTodo = useCallback(async () => {
    try {
      // @ts-ignore
      const { message } = await apiClient.post("/todos", { name });
      setName("");
      refreshTodos();
    } catch (err: any) {
      setName("");
      alert(err.message);
    }
  }, [name]);

  const toggleTodoStatus = useCallback(async (id: string) => {
    try {
      // @ts-ignore
      const { message } = await apiClient.patch(`/todos/${id}`);
      alert(message);
      refreshTodos();
    } catch (err: any) {
      alert(err.message);
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flexDirection: "column",
          display: "flex",
          marginBottom: 30,
        }}
      >
        <img
          style={{ marginRight: 30, alignSelf: "center" }}
          width="10%"
          height="10%"
          src="ampt.svg"
        />
        <h1>Ampt TODO List</h1>
      </div>
      {loading ? (
        <div style={{ display: "flex", alignSelf: "center" }}>Loading...</div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            width: "100%",
          }}
        >
          {todos.map((todo) => (
            <div
              key={todo.id}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                marginBottom: 10,
              }}
            >
              <div
                style={{ alignSelf: "center" }}
                onClick={() => toggleTodoStatus(todo.id)}
              >
                {todo.status === "complete" ? <CheckCircle /> : <Circle />}
              </div>
              <div
                style={{ alignSelf: "center", marginBottom: 5, marginLeft: 10 }}
              >
                <h3>{todo.name}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ alignSelf: "center", marginBottom: 10 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <input
            type="text"
            placeholder="Enter a new todo item"
            value={name}
            onChange={(event) => setName(event.target.value)}
            style={{ marginRight: 10, padding: 10 }}
          />
          <button
            onClick={() => {
              if (name.length) {
                submitTodo();
              }
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
