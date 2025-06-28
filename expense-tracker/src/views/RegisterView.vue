<script setup>
import { ref } from "vue";
import { supabase } from "../utils/supabase";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const success = ref(false);

const register = async () => {
  error.value = "";
  success.value = false;
  loading.value = true;
  const { error: signUpError } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });
  loading.value = false;
  if (signUpError) {
    error.value = signUpError.message;
  } else {
    success.value = true;
    email.value = "";
    password.value = "";
    router.push("/expenses");
  }
};
</script>

<template>
  <div
    class="max-w-md mx-auto mt-8 p-8 border border-gray-200 rounded-lg shadow bg-white"
  >
    <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>
    <form @submit.prevent="register" class="space-y-5">
      <div>
        <label for="email" class="block mb-1 font-medium text-gray-700"
          >Email:</label
        >
        <input
          v-model="email"
          type="email"
          id="email"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label for="password" class="block mb-1 font-medium text-gray-700"
          >Password:</label
        >
        <input
          v-model="password"
          type="password"
          id="password"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <button
        type="submit"
        :disabled="loading"
        class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        Register
      </button>
      <p v-if="error" class="text-red-600 text-center">{{ error }}</p>
      <p v-if="success" class="text-green-600 text-center">
        Registration successful! Please check your email.
      </p>
    </form>
  </div>
</template>
