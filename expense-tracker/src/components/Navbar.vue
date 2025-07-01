<script setup>
import { ref, onMounted, watch } from "vue";
import { supabase } from "../utils/supabase";
import { useRouter } from "vue-router";
import { RouterLink } from "vue-router";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { Bars3Icon } from "@heroicons/vue/24/outline";

const router = useRouter();

const isLoggedIn = ref(false);
const selectedDate = ref(null);
const mobileMenuOpen = ref(false);
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
    mobileMenuOpen.value = false; // Close menu on navigation
  }
});

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error logging out:", error);
  } else {
    isLoggedIn.value = false;
    router.push("/");
    mobileMenuOpen.value = false;
  }
};
</script>

<template>
  <nav class="flex items-center bg-gray-200 text-gray-600 px-8 py-4 relative">
    <!-- Always show Expense Tracker top left -->
    <RouterLink
      to="/expenses"
      class="text-2xl font-bold whitespace-nowrap mr-4"
    >
      Expense Tracker
    </RouterLink>

    <!-- Desktop Menu (date picker only, does not fill space) -->
    <div class="hidden sm:flex items-center">
      <VueDatePicker
        v-if="isLoggedIn"
        v-model="selectedDate"
        month-picker
        auto-apply
        class="text-xl ml-2 mt-0.5 cursor-pointer"
        placeholder="View By Month"
      />
    </div>
    <!-- Desktop Logout Button (top right) -->
    <div class="hidden sm:flex ml-auto">
      <button
        v-if="isLoggedIn"
        @click="handleLogout"
        class="bg-blue-500 hover:bg-blue-600 text-gray-50 font-semibold py-2 px-5 rounded transition cursor-pointer"
      >
        Logout
      </button>
    </div>

    <!-- Hamburger Button (Mobile Only, top right) -->
    <button
      class="sm:hidden ml-auto"
      @click="mobileMenuOpen = !mobileMenuOpen"
      aria-label="Open menu"
    >
      <Bars3Icon class="w-8 h-8" />
    </button>

    <!-- Mobile Menu -->
    <div
      v-if="mobileMenuOpen"
      class="sm:hidden flex flex-col items-start bg-gray-200 px-8 py-4 absolute top-full left-0 w-full z-50 shadow"
    >
      <VueDatePicker
        v-if="isLoggedIn"
        v-model="selectedDate"
        month-picker
        auto-apply
        class="text-xl mb-4 cursor-pointer"
        placeholder="View By Month"
      />
      <div class="w-full flex justify-center">
        <button
          v-if="isLoggedIn"
          @click="
            () => {
              handleLogout();
              mobileMenuOpen = false;
            }
          "
          class="bg-blue-500 hover:bg-blue-600 text-gray-50 font-semibold py-2 px-5 rounded transition cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>
