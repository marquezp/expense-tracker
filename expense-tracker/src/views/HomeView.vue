<script setup>
import ExpenseList from "../components/ExpenseList.vue";
import { RouterLink } from "vue-router";
</script>
<template>
  <div class="flex flex-col items-center mt-10">
    <h1
      class="text-4xl font-bold text-blue-600 mb-4 shadow-lg px-6 py-2 rounded-lg bg-white"
    >
      Welcome
    </h1>
    <RouterLink
      :to="'expenses/add'"
      class="mb-6 bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-md"
    >
      Add New Expense
    </RouterLink>
    <div class="w-full max-w-2xl">
      <ExpenseList />
    </div>
  </div>
</template>
