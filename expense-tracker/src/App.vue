<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <div class="min-h-screen bg-orange-50">
    <Navbar />
    <!-- :key="$route.fullPath" ensures reactivity on route parameter changes -->
    <RouterView :key="$route.fullPath" />
  </div>
</template>
