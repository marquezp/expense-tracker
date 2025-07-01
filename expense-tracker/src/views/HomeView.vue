<script setup>
import { ref, onMounted } from "vue";
import ExpenseList from "../components/ExpenseList.vue";
import TotalExpenses from "../components/TotalExpenses.vue";
import { RouterLink } from "vue-router";
import { supabase } from "../utils/supabase";

const expenses = ref([]);
const isLoading = ref(true);

const month = new Date().getMonth() + 1; // Current month (1-12)
const year = new Date().getFullYear(); // Current year

// Fetch expenses when HomeView is loaded
onMounted(async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  if (!userId) {
    isLoading.value = false;
    return;
  }

  // Calculate the start and end of the current month in UTC
  const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userId)
    .gte("created", startDate.toISOString()) // Start of the month
    .lte("created", endDate.toISOString()) // End of the month
    .order("created", { ascending: false });
  if (!error) expenses.value = data;
  isLoading.value = false;

  // Fetch recurring expenses
  const { data: recurringData, error: recurringError } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userId)
    .eq("is_recurring", true);

  if (!recurringError) {
    // Get IDs of already fetched expenses
    const existingIds = new Set(expenses.value.map((e) => e.id));
    // Only add recurring expenses that are not already in the list
    const newRecurring = recurringData
      .filter((recurringExpense) => !existingIds.has(recurringExpense.id))
      .map((recurringExpense) => ({
        ...recurringExpense,
        created: new Date(
          Date.UTC(year, month - 1, recurringExpense.recurring_day, 0, 0, 0)
        ).toISOString(),
      }));
    expenses.value.push(...newRecurring);
    isLoading.value = false;
  }
});

// When an expense is deleted, update the array
function handleExpenseDeleted(expenseId) {
  expenses.value = expenses.value.filter((exp) => exp.id !== expenseId);
}
</script>

<template>
  <div class="flex flex-col items-center mt-10">
    <TotalExpenses
      :expenses="expenses"
      :month="month"
      :year="year"
      class="mb-6"
    />
    <RouterLink
      :to="'expenses/add'"
      class="mb-6 bg-green-200 hover:bg-green-300 text-gray-700 font-bold py-2 px-4 rounded shadow-md"
    >
      Add New Expense
    </RouterLink>
    <div class="w-full max-w-2xl">
      <ExpenseList
        :expenses="expenses"
        :isLoading="isLoading"
        @deleted="handleExpenseDeleted"
      />
    </div>
    <!-- Message when no expenses are found -->
    <div v-if="!isLoading && expenses.length === 0" class="text-center">
      <p class="text-gray-500 text-xl">
        No expenses have been added in
        {{
          new Date(year, month - 1).toLocaleString("default", {
            month: "long",
          })
        }}...
      </p>
    </div>
  </div>
</template>
