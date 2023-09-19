import useSWR from "swr";
import { apiClient } from "../utility/api";

type ListTodosResponse = {
  items: {
    id: string;
    name: string;
    status: "complete" | "incomplete";
  }[];
};

export function useTodos(): {
  todos: ListTodosResponse["items"] | [];
  loading: boolean;
  refresh: () => Promise<ListTodosResponse | undefined>;
} {
  const { data, mutate, isLoading, isValidating } = useSWR<ListTodosResponse>(
    "/todos",
    (url) => apiClient({ url })
  );
  const loading = isLoading || isValidating;
  return { todos: data?.items ?? [], refresh: mutate, loading };
}
