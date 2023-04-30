<script setup lang="ts">
import { computed, ref } from "vue";
import { TodoItem } from "api";
import { api } from "../api";

const newTodoTitle = ref("");
const todos = ref<TodoItem[]>([]);

api
	.getAllTodos()
	.then((data) => {
		todos.value = data;
	})
	.catch((err) => {
		console.log(err);
	});

function addTodo() {
	if (!newTodoTitle.value.trim()) {
		return;
	}

	api
		.createTodo({
			title: newTodoTitle.value,
		})
		.then((data) => {
			todos.value.unshift(data);
		})
		.catch((err) => {
			console.log(err);
		})
		.finally(() => {
			newTodoTitle.value = "";
		});
}

function removeTodo(todo: TodoItem) {
	const index = todos.value.indexOf(todo);
	todos.value.splice(index, 1);

	api
		.deleteTodoById(undefined, {
			params: {
				id: todo.id,
			},
		})
		.catch((err) => {
			console.log(err);

			// rollback
			todos.value.splice(index, 0, todo);
		});
}

function toggleTodoCompleted(todo: TodoItem) {
	todo.completed = !todo.completed;
	api
		.updateTodoById(
			{
				completed: todo.completed,
			},
			{
				params: {
					id: todo.id,
				},
			},
		)
		.catch((err) => {
			console.log(err);

			// rollback
			todo.completed = !todo.completed;
		});
}

const activeTodoCount = computed(() => {
	return todos.value.filter((todo) => !todo.completed).length;
});
</script>

<template>
	<div class="bg-gray-100 min-h-screen flex justify-center items-center overflow-x-hidden">
		<div class="mx-auto w-[42rem] bg-white p-8 my-8 rounded-xl">
			<h1 class="mb-8 text-4xl font-bold">Todo App</h1>
			<form class="mb-8" @submit.prevent="addTodo">
				<input
					v-model.trim="newTodoTitle"
					class="w-full rounded-md border-gray-300 p-2 shadow-sm"
					placeholder="What needs to be done?"
				/>
			</form>
			<ul class="mb-8">
				<li
					v-for="todo in todos"
					:key="todo.id"
					class="flex items-center justify-between border-b border-gray-200 py-2 last:border-b-0"
				>
					<div>
						<input
							type="checkbox"
							:checked="todo.completed"
							class="mr-2"
							@change="toggleTodoCompleted(todo)"
						/>
						<span :class="{ 'line-through': todo.completed }">{{ todo.title }}</span>
					</div>
					<button class="text-gray-400 hover:text-gray-600" @click="removeTodo(todo)">
						<svg
							class="h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							></path>
						</svg>
					</button>
				</li>
			</ul>
			<div class="flex items-center text-sm text-gray-500">
				<span>{{ activeTodoCount }} item(s) left</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
.line-through {
	text-decoration: line-through;
}
</style>
