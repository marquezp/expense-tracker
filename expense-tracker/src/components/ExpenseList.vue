<script setup>
// Script logic will go here
import { reactive, onMounted } from "vue";
import Expense from "./Expense.vue";
import { supabase } from "../utils/supabase";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

const state = reactive({
  expenses: [],
  isLoading: true,
});

// Load expenses from the API when the component is mounted
onMounted(async () => {
  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;

  if (!userId) {
    state.isLoading = false;
    return;
  }

  // Fetch expenses for the current user
  try {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });
    if (error) throw error;
    state.expenses = data;
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
  } finally {
    state.isLoading = false;
  }
});

// Remove the deleted expense from the list
const handleExpenseDeleted = (expenseId) => {
  console.log("Expense deleted:", expenseId);
  state.expenses = state.expenses.filter((expense) => expense.id !== expenseId);
};
</script>

<template>
  <!-- Loading spinner-->
  <div v-if="state.isLoading" class="text-center"><PulseLoader /></div>

  <!-- Display the list of expenses when done loading-->
  <div v-else>
    <h2 class="text-2xl font-semibold mb-4 text-center text-gray-700">
      Your Current Expenses
    </h2>

    <Expense
      v-for="expense in state.expenses"
      :key="expense.id"
      :expense="expense"
      @deleted="handleExpenseDeleted"
    />
  </div>
  <!-- Message when no expenses are found -->
  <div
    v-if="!state.isLoading && state.expenses.length === 0"
    class="text-center"
  >
    <p class="text-gray-500 text-xl">No expenses found.</p>
  </div>
</template>
