<script setup lang="ts">
//to use the array from the library
import { ref, onMounted } from 'vue';
import axios from 'axios';

//to define the properties of the task
interface Task {
  _id: string;
  title: string;
  editing: boolean;
}

// new task will be asked for an input while task list will be in an array
const newTask = ref('');
const taskList = ref<Task[]>([]);

//function to add the task, use reference below for function declaration (this one cannot post into database)
// const addTask = () => {
//   if (newTask.value) {
//     taskList.value.push({
//       title: newTask.value,
//       editing: false,
//       _id: '',
//     });
//     newTask.value = '';
//   }
// };

//function to add the task, use reference below for function declaration
const addTask = async () => {
  if (newTask.value) {
    const taskData = {
      title: newTask.value,
    };
    try {
      const response = await axios.post(
        'http://localhost:3001/tasks',
        taskData
      );
      taskList.value.push(response.data);
      newTask.value = '';
      location.reload();
    } catch (error) {
      console.error(error);
    }
  }
};

//function to delete the task (will not update in database)
// function deleteTask(index: number) {
//   taskList.value.splice(index, 1);
// }

//function to delete the task
async function deleteTask(index: number, taskId: string) {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      await axios.delete(`http://localhost:3001/tasks/${taskId}`);
      taskList.value.splice(index, 1);
      location.reload();
    } catch (error) {
      console.error(error);
    }
  }
}

//function to update the task (will not update in the database)
// function editTask(index: number, newTitle: string) {
//   taskList.value[index].title = newTitle;
//   taskList.value[index].editing = false;
// }

//function to update the task
async function editTask(index: number, newTitle: string, taskId: string) {
  try {
    await axios.put(`http://localhost:3001/tasks/${taskId}`, {
      title: newTitle,
    });
    taskList.value[index].title = newTitle;
    taskList.value[index].editing = false;
    location.reload();
  } catch (error) {
    console.error(error);
  }
}

function toggleEdit(index: number) {
  taskList.value[index].editing = !taskList.value[index].editing;
}

// const { data } = await useFetch(() => 'localhost:3001/tasks');
// const { data: tasks } = await useAsyncData('task', () =>
//   $fetch('localhost:3001/tasks')
// );
const { data: tasks, pending } = await useFetch<Task[]>(
  'http://localhost:3001/tasks'
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
          <div v-if="!pending">
            <li v-for="(task, index) in tasks" :key="task._id">
              <span class="mr-2">{{ index + 1 }}. </span>
              <input
                type="text"
                v-model="task.title"
                :disabled="!task.editing"
              />
              <button
                v-if="!task.editing"
                class="px-4 py-2 m-4 font-bold text-white bg-green-600 rounded"
                @click="task.editing = true"
              >
                Edit
              </button>
              <button
                v-else
                class="px-4 py-2 m-4 font-bold text-white bg-blue-600 rounded"
                @click="editTask(index, task.title, task._id)"
              >
                Save
              </button>

              <button
                class="px-4 py-2 font-bold text-white bg-red-600 rounded"
                @click="deleteTask(index, task._id)"
              >
                Delete
              </button>
            </li>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
input[type='checkbox'].form-checkbox {
  display: none;
}
</style>
