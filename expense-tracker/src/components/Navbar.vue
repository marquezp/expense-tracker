<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../utils/supabase";
import { useRouter } from "vue-router";
import { RouterLink } from "vue-router";

const router = useRouter();

const isLoggedIn = ref(false);
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
    class="flex justify-between items-center bg-gray-800 text-white px-8 py-4"
  >
    <RouterLink to="/expenses" class="text-2xl font-bold"
      >Expense Tracker</RouterLink
    >
    <div>
      <button
        v-if="isLoggedIn"
        @click="handleLogout"
        class="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded transition cursor-pointer"
      >
        Logout
      </button>
    </div>
  </nav>
</template>
