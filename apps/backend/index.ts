import { zodiosApp } from "@zodios/express";
import { TodoItem, endpoints } from "api";
import { v4 as uuidv4 } from "uuid";

const app = zodiosApp(endpoints);

// TODO: use database instead of in-memory data
const todos: TodoItem[] = [
    { id: "b5f713b0-6247-496d-9b02-3e1faf3ebbd3", title: "Todo 1", completed: false },
    { id: "0352304c-1eb2-4d66-bb41-cf4bd5737d53", title: "Todo 2", completed: false },
    { id: "8ea45006-4dfd-4d12-987d-ba304553c7ed", title: "Todo 3", completed: false},
    { id: "60adcc13-aea5-4b6d-bf7b-6e29bcdf038c", title: "Todo 4", completed: true}
];

app.get("/todos", (req, res) => {
    return res.json(todos);
});

app.post("/todos", (req, res) => {
    const todo: TodoItem = {
        id: uuidv4(),
        title: req.body.title,
        completed: false
    }
    todos.push(todo);
    return res.json(todo);
});

app.get("/todos/:id", (req, res) => {
    const todo = todos.find(t => t.id === req.params.id);
    if (!todo) {
        return res.status(404).json({ 
            code: 404,
            message: "Todo item not found"
        });
    }
    return res.json(todo);
});

app.patch("/todos/:id", (req, res) => {
    let todo = todos.find(t => t.id === req.params.id);
    if (!todo) {
        return res.status(404).json({ 
            code: 404,
            message: "Todo item not found"
        });
    }
    todo.title = req.body.title;
    return res.json(todo);
});

app.delete("/todos/:id", (req, res) => {
    const index = todos.findIndex(t => t.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ 
            code: 404,
            message: "Todo item not found"
        });
    }
    todos.splice(index, 1);
    return res.json();
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});