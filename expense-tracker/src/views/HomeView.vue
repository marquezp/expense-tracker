<script setup>
import { ref, onMounted } from "vue";
import ExpenseList from "../components/ExpenseList.vue";
import TotalExpenses from "../components/TotalExpenses.vue";
import { RouterLink } from "vue-router";
import { supabase } from "../utils/supabase";

const expenses = ref([]);
const isLoading = ref(true);

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
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userId)
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
    <TotalExpenses :expenses="expenses" class="mb-6" />
    <RouterLink
      :to="'expenses/add'"
      class="mb-6 bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-md"
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
  </div>
</template>
