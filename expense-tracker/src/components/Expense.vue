<script setup>
import { ref } from "vue";
import { supabase } from "../utils/supabase";
import { RouterLink } from "vue-router";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/24/outline";

const emit = defineEmits(["deleted"]);

const props = defineProps({
  expense: {
    type: Object,
  },
});

const showDescription = ref(false);

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
  <!-- Expense Card Container -->
  <div
    :class="[
      'flex flex-col justify-between py-3 px-4 rounded-lg shadow-sm mb-3 transition-all duration-300',
      getCategoryBg(expense.category),
      showDescription ? 'mb-6' : '',
    ]"
  >
    <!-- Top Row: Title, Price, Category, Date, Delete Button -->
    <div class="flex justify-between items-center">
      <!-- Link to Edit Expense -->
      <RouterLink :to="`/expenses/edit/${expense.id}`" class="flex-1">
        <div>
          <h3 class="text-lg font-semibold">{{ expense.title }}</h3>
          <p class="text-gray-600">${{ expense.price }}</p>
          <span class="inline-block text-xs font-medium text-gray-700 mt-1">
            {{ expense.category }}
          </span>
        </div>
      </RouterLink>
      <!-- Expense Date on the right -->
      <span class="text-gray-500 text-sm ml-4">
        {{
          (() => {
            // Parse UTC date string and display in user's local time zone
            const utcDate = new Date(expense.created + "Z");
            return utcDate.toLocaleString(undefined, {
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });
          })()
        }}
      </span>
      <!-- Delete Button on the right -->
      <button
        type="button"
        @click.stop="handleDelete"
        class="bg-red-400 text-white rounded px-4 py-2 hover:bg-red-500 cursor-pointer ml-4"
      >
        Delete
      </button>
    </div>

    <!-- Description Dropdown Section -->
    <div v-if="expense.description" class="">
      <!-- Show Dropdown Arrow if Description is Hidden -->
      <button
        v-if="!showDescription"
        class="flex justify-center w-full text-blue-500 underline text-sm focus:outline-none"
        @click="showDescription = true"
      >
        <ChevronDownIcon class="w-5 h-5 text-neutral-700" />
      </button>
      <!-- Description Content with Transition -->
      <div
        v-if="showDescription"
        class="transition-all duration-300 ease-in-out opacity-100 max-h-40"
      >
        <!-- Expense Description Text -->
        <p class="text-gray-600 text-center mb-2 mt-2">
          {{ expense.description }}
        </p>
        <!-- Hide Dropdown Arrow when Description is Visible -->
        <button
          class="flex justify-center w-full text-blue-500 underline text-xs focus:outline-none"
          @click="showDescription = false"
        >
          <ChevronUpIcon class="w-5 h-5 text-neutral-400" />
        </button>
      </div>
    </div>
  </div>
</template>
