<script setup>
import Expense from "./Expense.vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { ref, computed } from "vue";

const emit = defineEmits(["deleted"]);
const sortBy = ref("date");

const props = defineProps({
  expenses: Array,
  isLoading: Boolean,
});

// emit event to parent when an expense is deleted
const handleExpenseDeleted = (expenseId) => {
  emit("deleted", expenseId);
};

// Function to handle sorting changes
const sortedExpenses = computed(() => {
  return [...props.expenses].sort((a, b) => {
    if (sortBy.value === "date") {
      return new Date(b.created) - new Date(a.created);
    }
    if (sortBy.value === "amount") {
      return b.price - a.price;
    }
    if (sortBy.value === "category") {
      return a.category.localeCompare(b.category);
    }
    return 0;
  });
});
</script>

<template>
  <!-- Loading spinner-->
  <div v-if="isLoading" class="text-center mt-18"><PulseLoader /></div>

  <div v-else-if="expenses.length > 0" class="mt-2">
    <!-- Sort Controls -->
    <div class="mb-4 flex gap-2 items-center justify-center">
      <select
        v-model="sortBy"
        id="sort"
        class="border-1 rounded px-1 py-1 focus:outline-none"
      >
        <option value="date" disabled selected>Sort by</option>
        <option value="date">Date</option>
        <option value="amount">Amount</option>
        <option value="category">Category</option>
      </select>
    </div>
    <!-- Display the list of expenses when done loading-->
    <div class="mx-4 sm:mx-0">
      <Expense
        v-for="expense in sortedExpenses"
        :key="expense.id"
        :expense="expense"
        @deleted="handleExpenseDeleted"
      />
    </div>
  </div>
</template>
