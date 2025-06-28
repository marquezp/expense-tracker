<script setup>
import { reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { supabase } from "../utils/supabase";

const router = useRouter();

const route = useRoute();
const expenseId = route.params.id;

const today = new Date().toISOString().slice(0, 10);

const form = reactive({
  title: "",
  price: "",
  category: "",
  date: today,
});

const handleSubmit = async () => {
  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;

  // Update the expense object with form data
  const updatedExpense = {
    title: form.title,
    price: parseFloat(form.price),
    category: form.category,
    date: form.date,
  };

  if (
    !updatedExpense.title ||
    !updatedExpense.price ||
    !updatedExpense.category ||
    !updatedExpense.date
  ) {
    console.error("All fields are required.");
    return;
  }

  if (isNaN(updatedExpense.price) || updatedExpense.price <= 0) {
    console.error("Price must be a positive number.");
    return;
  }

  // Send the updated expense to the API
  try {
    const { data, error } = await supabase
      .from("expenses")
      .update(updatedExpense)
      .eq("id", expenseId)
      .eq("user_id", userId);
    if (error) throw error;
    router.push("/expenses");
  } catch (error) {
    console.error("Error updating expense:", error);
  }
};

onMounted(async () => {
  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;

    // Fetch the expense from Supabase
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("id", expenseId)
      .eq("user_id", userId)
      .single();

    if (error) throw error;

    form.title = data.title;
    form.price = data.price;
    form.category = data.category;
    // Convert ISO date to yyyy-MM-dd for the input
    form.date = data.date ? data.date.slice(0, 10) : "";
  } catch (error) {
    console.error("Error fetching expense:", error);
  }
});
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4 text-center">Edit Expense</h2>
    <form @submit.prevent="handleSubmit">
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
          class="mt-1 block w-full py-2 px-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
          class="mt-1 block w-full py-2 px-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
          class="mt-1 block w-full py-2 px-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Update Expense
      </button>
    </form>
  </div>
</template>
