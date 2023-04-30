import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const TodoItem = z.object({
  id: z.string().uuid(),
  title: z.string().min(5),
  completed: z.boolean(),
});
const TodoItemPayload = z.object({ title: z.string().min(5) });
const TodoError = z.object({ code: z.number().int(), message: z.string() });
const UpdateTodoItemPayload = z.object({ completed: z.boolean() });

export type TodoItem = z.infer<typeof TodoItem>;
export type TodoItemPayload = z.infer<typeof TodoItemPayload>;
export type TodoError = z.infer<typeof TodoError>;
export type UpdateTodoItemPayload = z.infer<typeof UpdateTodoItemPayload>;

export const schemas = {
  TodoItem,
  TodoItemPayload,
  TodoError,
  UpdateTodoItemPayload,
};

export const endpoints = makeApi([
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
        schema: z.object({ title: z.string().min(5) }),
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
    method: "patch",
    path: "/todos/:id",
    alias: "updateTodoById",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ completed: z.boolean() }),
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
