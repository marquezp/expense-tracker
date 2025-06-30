<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../utils/supabase";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { useToast } from "vue-toastification";

const toast = useToast();
const router = useRouter();

// Reactive form state
const form = reactive({
  title: "",
  price: "",
  category: "",
  description: "",
  isLoading: false,
});

const addExpense = async () => {
  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;

  // Create a new expense object with form data
  const newExpense = {
    title: form.title,
    price: parseFloat(form.price),
    category: form.category,
    description: form.description,
    user_id: userId,
    created: new Date().toISOString(),
  };

  // Make sure all required fields are filled out
  if (!newExpense.title || !newExpense.price || !newExpense.category) {
    console.error("All fields are required.");
    return;
  }

  // Validate that price is a positive number
  if (isNaN(newExpense.price) || newExpense.price <= 0) {
    console.error("Price must be a positive number.");
    return;
  }

  // Send the new expense to supabase
  try {
    form.isLoading = true;
    const { data, error } = await supabase
      .from("expenses")
      .insert([newExpense]);
    if (error) throw error;
    router.push("/expenses");
    toast.success("Expense added successfully!");
  } catch (error) {
    console.error("Error adding expense:", error);
    toast.error("Error adding expense.");
    form.isLoading = false;
  }
};
</script>

<template>
  <div
    v-if="!form.isLoading"
    class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md"
  >
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
        <select
          v-model="form.category"
          id="category"
          required
          class="mt-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="" disabled>Select category</option>
          <option value="Groceries">Groceries</option>
          <option value="Food">Food</option>
          <option value="Living">Living</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Travel">Travel</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div class="mb-4">
        <label for="description" class="block text-sm font-medium text-gray-700"
          >Description</label
        >
        <textarea
          v-model="form.description"
          placeholder="Add an optional description..."
          id="description"
          rows="3"
          class="mt-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>
      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
      >
        Add Expense
      </button>
    </form>
  </div>
  <div v-else class="text-center mt-64">
    <PulseLoader />
  </div>
</template>
