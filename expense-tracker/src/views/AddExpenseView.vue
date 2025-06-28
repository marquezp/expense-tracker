<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../utils/supabase";

const router = useRouter();
const today = new Date().toISOString().slice(0, 10);
const form = reactive({
  title: "",
  price: "",
  category: "",
  date: today,
});

const addExpense = async () => {
  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;

  const newExpense = {
    title: form.title,
    price: parseFloat(form.price),
    category: form.category,
    date: form.date,
    user_id: userId,
  };

  if (
    !newExpense.title ||
    !newExpense.price ||
    !newExpense.category ||
    !newExpense.date
  ) {
    console.error("All fields are required.");
    return;
  }

  if (isNaN(newExpense.price) || newExpense.price <= 0) {
    console.error("Price must be a positive number.");
    return;
  }

  // Send the new expense to supabase
  try {
    const { data, error } = await supabase
      .from("expenses")
      .insert([newExpense]);
    if (error) throw error;
    router.push("/expenses");
  } catch (error) {
    console.error("Error adding expense:", error);
  }
};
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4 text-center">Add New Expense</h2>
    <form @submit.prevent="addExpense">
      <div class="mb-4">
        <label for="title" class="block text-sm font-medium text-gray-700"
          >Title</label
        >
        <input
          v-model="form.title"
          type="text"
          id="title"
          required
          class="mt-1 block w-full py-2 px-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div class="mb-4">
        <label for="price" class="block text-sm font-medium text-gray-700"
          >Price</label
        >
        <input
          v-model="form.price"
          type="float"
          id="price"
          required
          class="mt-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div class="mb-4">
        <label for="category" class="block text-sm font-medium text-gray-700"
          >Category</label
        >
        <input
          v-model="form.category"
          type="text"
          id="category"
          required
          class="mt-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div class="mb-4">
        <label for="date" class="block text-sm font-medium text-gray-700"
          >Date</label
        >
        <input
          v-model="form.date"
          type="date"
          id="date"
          required
          class="mt-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Add Expense
      </button>
    </form>
  </div>
</template>
