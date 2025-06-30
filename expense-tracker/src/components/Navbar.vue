<script setup>
import { ref, onMounted, watch } from "vue";
import { supabase } from "../utils/supabase";
import { useRouter } from "vue-router";
import { RouterLink } from "vue-router";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const router = useRouter();

const isLoggedIn = ref(false);
const selectedDate = ref(null);
let authListener = null;

onMounted(async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  isLoggedIn.value = !!user;

  authListener = supabase.auth.onAuthStateChange((_event, session) => {
    isLoggedIn.value = !!session?.user;
  });
});

// Watch for changes to the selected date
watch(selectedDate, async (date) => {
  if (date) {
    const year = date.year;
    const month = String(date.month + 1).padStart(2, "0");
    await router.push(`/expenses/${year}/${month}`);
    selectedDate.value = null; // Reset selectedDate to ensure reactivity
  }
});

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error logging out:", error);
  } else {
    isLoggedIn.value = false;
    router.push("/");
  }
};
</script>

<template>
  <nav
    class="flex justify-between items-center bg-gray-500 text-gray-50 px-8 py-4"
  >
    <div class="flex items-center min-w-0">
      <RouterLink
        to="/expenses"
        class="text-2xl font-bold whitespace-nowrap mr-4"
      >
        Expense Tracker
      </RouterLink>
      <VueDatePicker
        v-if="isLoggedIn"
        v-model="selectedDate"
        month-picker
        auto-apply
        class="text-xl ml-2 mt-0.5 cursor-pointer"
        placeholder="View Past Months"
      />
    </div>
    <div>
      <button
        v-if="isLoggedIn"
        @click="handleLogout"
        class="bg-blue-400 hover:bg-blue-600 text-gray-50 font-semibold py-2 px-5 rounded transition cursor-pointer"
      >
        Logout
      </button>
    </div>
  </nav>
</template>
