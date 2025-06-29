<script setup>
import { supabase } from "../utils/supabase";
import { RouterLink, useRouter } from "vue-router";

const emit = defineEmits();

const props = defineProps({
  expense: {
    type: Object,
  },
});

// Map categories to background color classes
const categoryBg = {
  groceries: "bg-green-100",
  food: "bg-red-100",
  living: "bg-yellow-100",
  entertainment: "bg-purple-100",
  travel: "bg-blue-100",
  other: "bg-gray-100",
};

function getCategoryBg(category) {
  return categoryBg[category?.toLowerCase()] || "bg-gray-100";
}

// API call to delete an expense
const handleDelete = async () => {
  try {
    const confirm = window.confirm(
      "Are you sure you want to delete this expense?"
    );
    if (confirm) {
      await supabase.from("expenses").delete().eq("id", props.expense.id);
      emit("deleted", props.expense.id); // Emit event after deletion
    }
  } catch (error) {
    console.error("Failed to delete expense:", error);
  }
};
</script>

<template>
  <div
    :class="`flex justify-between items-center py-3 px-4 rounded-lg shadow-sm mb-3 ${getCategoryBg(
      expense.category
    )}`"
  >
    <RouterLink
      :to="`/expenses/edit/${expense.id}`"
      class="flex-1"
      style="text-decoration: none"
    >
      <div>
        <h3 class="text-lg font-semibold">{{ expense.title }}</h3>
        <p class="text-gray-600">${{ expense.price }}</p>
        <span class="inline-block text-xs font-medium text-gray-700 mt-1">{{
          expense.category
        }}</span>
      </div>
    </RouterLink>
    <button
      type="button"
      @click.stop="handleDelete"
      class="bg-red-400 text-white rounded px-4 py-2 hover:bg-red-500 cursor-pointer ml-4"
    >
      Delete
    </button>
  </div>
</template>
