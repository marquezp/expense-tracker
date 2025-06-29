<script setup>
import { reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { supabase } from "../utils/supabase";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

const router = useRouter();

const route = useRoute();
const expenseId = route.params.id;

const form = reactive({
  title: "",
  price: "",
  category: "",
  isLoading: true,
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
  };

  if (
    !updatedExpense.title ||
    !updatedExpense.price ||
    !updatedExpense.category
  ) {
    console.error("All fields are required.");
    return;
  }

  if (isNaN(updatedExpense.price) || updatedExpense.price <= 0) {
    console.error("Price must be a positive number.");
    return;
  }

  console.log(updatedExpense);
  console.log("expenseId:", expenseId, "userId:", userId);

  // Send the updated expense to the API
  try {
    const { data, error } = await supabase
      .from("expenses")
      .update(updatedExpense)
      .eq("id", expenseId)
      .eq("user_id", userId)
      .select();
    if (error) throw error;
    router.push("/expenses");
    console.log(data);
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
  } catch (error) {
    console.error("Error fetching expense:", error);
  } finally {
    form.isLoading = false;
  }
});
</script>

<template>
  <div
    v-if="!form.isLoading"
    class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md"
  >
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
          type="number"
          step="0.01"
          id="price"
          required
          class="mt-1 block w-full py-2 px-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
      <button
        type="submit"
        class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
      >
        Update Expense
      </button>
    </form>
  </div>
  <div v-else class="text-center mt-64">
    <PulseLoader />
  </div>
</template>
