<script setup lang="ts">
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { Todo } from "./types/Todo";

const newTodoText = ref("");
const todos = ref<Todo[]>([]);

function addTodo() {
	if (!newTodoText.value.trim()) {
		return;
	}

	todos.value.push({
		id: uuidv4(),
		text: newTodoText.value.trim(),
		completed: false,
	});
	newTodoText.value = "";
}

function removeTodo(todo: Todo) {
	const index = todos.value.indexOf(todo);
	todos.value.splice(index, 1);
}

function toggleTodoCompleted(todo: Todo) {
	todo.completed = !todo.completed;
}

function removeCompletedTodos() {
	todos.value = todos.value.filter((todo) => !todo.completed);
}

function getActiveTodoCount() {
	return todos.value.filter((todo) => !todo.completed).length;
}

function getCompletedTodoCount() {
	return todos.value.filter((todo) => todo.completed).length;
}

const activeTodoCount = getActiveTodoCount();
const completedTodoCount = getCompletedTodoCount();
</script>
<template>
	<div class="mx-auto max-w-lg px-4">
		<h1 class="mb-8 text-4xl font-bold">TodoMVC</h1>
		<form class="mb-8" @submit.prevent="addTodo">
			<input
				v-model.trim="newTodoText"
				class="w-full rounded-md border-gray-300 p-2 shadow-sm"
				placeholder="What needs to be done?"
			/>
		</form>
		<ul>
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
					<span :class="{ 'line-through': todo.completed }">{{ todo.text }}</span>
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
			<button
				v-if="completedTodoCount > 0"
				class="ml-auto text-gray-400 hover:text-gray-600"
				@click="removeCompletedTodos"
			>
				Clear completed
			</button>
		</div>
	</div>
</template>

<style scoped>
.line-through {
	text-decoration: line-through;
}
</style>
