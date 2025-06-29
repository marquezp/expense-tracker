<script setup>
import Expense from "./Expense.vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

const props = defineProps({
  expenses: Array,
  isLoading: Boolean,
});

const emit = defineEmits(["deleted"]);

const handleExpenseDeleted = (expenseId) => {
  emit("deleted", expenseId);
};
</script>

<template>
  <!-- Loading spinner-->
  <div v-if="isLoading" class="text-center mt-54"><PulseLoader /></div>

  <!-- Display the list of expenses when done loading-->
  <div v-else>
    <h2 class="text-2xl font-semibold mb-4 text-center text-gray-700">
      Your Current Expenses
    </h2>

    <Expense
      v-for="expense in expenses"
      :key="expense.id"
      :expense="expense"
      @deleted="handleExpenseDeleted"
    />
  </div>
  <!-- Message when no expenses are found -->
  <div v-if="!isLoading && expenses.length === 0" class="text-center">
    <p class="text-gray-500 text-xl">No expenses found.</p>
  </div>
</template>
