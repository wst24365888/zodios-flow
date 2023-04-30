import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const TodoItem = z.object({
  id: z.string().uuid(),
  title: z.string(),
  completed: z.boolean(),
});
const NewTodoItem = z.object({
  title: z.string(),
  completed: z.boolean().optional(),
});
const TodoError = z.object({ code: z.number().int(), message: z.string() });
const UpdateTodoItem = z
  .object({ title: z.string(), completed: z.boolean() })
  .partial();

export type TodoItem = z.infer<typeof TodoItem>;
export type NewTodoItem = z.infer<typeof NewTodoItem>;
export type TodoError = z.infer<typeof TodoError>;
export type UpdateTodoItem = z.infer<typeof UpdateTodoItem>;

export const schemas = {
  TodoItem,
  NewTodoItem,
  TodoError,
  UpdateTodoItem,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/todos",
    alias: "getAllTodos",
    requestFormat: "json",
    response: z.array(TodoItem),
  },
  {
    method: "post",
    path: "/todos",
    alias: "createTodo",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: NewTodoItem,
      },
    ],
    response: TodoItem,
    errors: [
      {
        status: 400,
        description: `Invalid input`,
        schema: TodoError,
      },
    ],
  },
  {
    method: "get",
    path: "/todos/:id",
    alias: "getTodoById",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: TodoItem,
    errors: [
      {
        status: 404,
        description: `Todo item not found`,
        schema: TodoError,
      },
    ],
  },
  {
    method: "put",
    path: "/todos/:id",
    alias: "updateTodoById",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateTodoItem,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: TodoItem,
    errors: [
      {
        status: 400,
        description: `Invalid input`,
        schema: TodoError,
      },
      {
        status: 404,
        description: `Todo item not found`,
        schema: TodoError,
      },
    ],
  },
  {
    method: "delete",
    path: "/todos/:id",
    alias: "deleteTodoById",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Todo item not found`,
        schema: TodoError,
      },
    ],
  },
]);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
