<script setup>
import { ref } from "vue";
import { supabase } from "../utils/supabase";
import { RouterLink } from "vue-router";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const error = ref("");

async function handleLogin() {
  error.value = "";
  if (email.value === "" || password.value === "") {
    error.value = "Please enter both email and password.";
    return;
  }
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });
  if (authError) {
    error.value = authError.message;
  } else {
    router.push("/expenses");
  }
}
</script>

<template>
  <div
    class="max-w-sm mx-auto mt-16 p-8 border border-gray-200 rounded-lg bg-gray-50 shadow"
  >
    <h2 class="text-2xl font-semibold mb-6 text-center">Log In</h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-4">
        <label for="email" class="block mb-1 font-medium text-gray-700"
          >Email:</label
        >
        <input
          v-model="email"
          type="email"
          id="email"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div class="mb-6">
        <label for="password" class="block mb-1 font-medium text-gray-700"
          >Password:</label
        >
        <input
          v-model="password"
          type="password"
          id="password"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <button
        type="submit"
        class="w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition"
      >
        Log In
      </button>
      <p v-if="error" class="text-red-600 mt-4 text-center">{{ error }}</p>
    </form>
    <div class="mt-6 text-center">
      <RouterLink to="/register" class="text-blue-600 hover:underline">
        Don't have an account? Register
      </RouterLink>
    </div>
  </div>
</template>
