<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "../utils/supabase";
import ExpenseList from "../components/ExpenseList.vue";
import TotalExpenses from "../components/TotalExpenses.vue";

const route = useRoute();
const expenses = ref([]);
const isLoading = ref(true);

const year = parseInt(route.params.year, 10);
const month = parseInt(route.params.month, 10);

// Fetch expenses when MonthView is loaded
onMounted(async () => {
  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  if (!userId) {
    isLoading.value = false;
    return;
  }

  // Calculate the start and end of the selected month in UTC
  const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  // Fetch expenses for the selected month
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userId)
    .gte("created", startDate.toISOString())
    .lte("created", endDate.toISOString())
    .order("created", { ascending: false });
  if (!error) expenses.value = data;
  isLoading.value = false;
});

// When an expense is deleted, update the array
function handleExpenseDeleted(expenseId) {
  expenses.value = expenses.value.filter((exp) => exp.id !== expenseId);
}
</script>

<template>
  <div class="flex flex-col items-center mt-10">
    <h1 v-if="expenses.length" class="text-xl mb-4">
      Here's a breakdown of that month's expenses...
    </h1>
    <TotalExpenses
      :expenses="expenses"
      :month="month"
      :year="year"
      class="mb-6"
    />
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
        📭 No expenses found for
        {{
          new Date(year, month - 1).toLocaleString("default", { month: "long" })
        }}
        {{ year }}.
      </p>
    </div>
  </div>
</template>
