<script setup>
// Script logic will go here
import { supabase } from "../utils/supabase";
import { RouterLink, useRouter } from "vue-router";

const emit = defineEmits();

const props = defineProps({
  expense: {
    type: Object,
  },
});

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
    class="flex justify-between items-center hover:bg-gray-100 py-3 px-4 rounded-lg shadow-sm mb-3"
  >
    <RouterLink
      :to="`/expenses/edit/${expense.id}`"
      class="flex-1"
      style="text-decoration: none"
    >
      <div>
        <h3 class="text-lg font-semibold">{{ expense.title }}</h3>
        <p class="text-gray-600">${{ expense.price }}</p>
      </div>
    </RouterLink>
    <button
      type="button"
      @click.stop="handleDelete"
      class="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 cursor-pointer ml-4"
    >
      Delete
    </button>
  </div>
</template>
