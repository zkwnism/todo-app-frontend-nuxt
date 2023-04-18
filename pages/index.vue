<script setup lang="ts">
//to use the array from the library
import { ref, onMounted } from 'vue';
import axios from 'axios';

//to define the properties of the task
interface Task {
  title: string;
  editing: boolean;
}

// new task will be asked for an input while task list will be in an array
const newTask = ref('');
const taskList = ref<Task[]>([]);

//function to add the task, use reference below for function declaration
const addTask = () => {
  if (newTask.value) {
    taskList.value.push({ title: newTask.value, editing: false });
    newTask.value = '';
  }
};

//function to delete the task
function deleteTask(index: number) {
  taskList.value.splice(index, 1);
}

//function to update the task
function editTask(index: number, newTitle: string) {
  taskList.value[index].title = newTitle;
  taskList.value[index].editing = false;
}

function toggleEdit(index: number) {
  taskList.value[index].editing = !taskList.value[index].editing;
}

// const { data } = await useFetch(() => 'localhost:3001/tasks');
const { data: tasks } = await useAsyncData('task', () =>
  $fetch('localhost:3001/tasks')
);
</script>

<template>
  <header>
    <div class="p-3 m-3 text-3xl font-bold">
      <h2 class="text-cyan-800">Welcome to my To-Do App</h2>
    </div>
  </header>
  <div class="container mx-auto bg-teal-200 rounded-md">
    <div class="p-10 font-semibold mt-9 text-1xl">
      <h3>Insert Your Task Below</h3>
      <div>
        <!-- this input is where we key in the task -->
        <input
          type="text"
          class="w-full px-2 py-1 border-b-2 border-gray-200 focus:outline-none focus:border-y-teal-950"
          v-model="newTask"
          @keydown.enter="addTask"
        />
        <div class="mt-3">
          <!-- this is the button to add the task -->
          <button
            class="px-4 py-2 font-bold text-white rounded bg-zinc-900"
            @click="addTask"
          >
            Add
          </button>
        </div>
      </div>
      <div class="mt-5">
        <h3>Task List</h3>
        <ul class="ml-5">
          <!-- the task will be printed from the array in a list form -->
          <li v-for="(task, index) in taskList" :key="index">
            <div v-if="!task.editing" class="border-b-2 border-teal-500">
              <span class="mr-2">{{ index + 1 }}.</span>
              <span>{{ task.title }}</span>
              <!-- button to edit the task -->
              <button
                class="px-4 py-2 m-4 font-bold text-white bg-green-600 rounded"
                @click="toggleEdit(index)"
              >
                Edit
              </button>
              <!-- button to delete the task  -->
              <button
                class="px-4 py-2 font-bold text-white bg-red-600 rounded"
                @click="deleteTask(index)"
              >
                Delete
              </button>
            </div>
            <div v-else>
              <input
                type="text"
                class="w-full px-2 py-1 border-b-2 border-gray-200 focus:outline-none focus:border-y-teal-950"
                v-model="task.title"
                @keydown.enter="editTask(index, task.title)"
                @blur="editTask(index, task.title)"
              />
            </div>
          </li>
        </ul>
        <div v-if="tasks">{{ tasks }}</div>
      </div>
    </div>
  </div>
</template>

<style>
input[type='checkbox'].form-checkbox {
  display: none;
}
</style>
