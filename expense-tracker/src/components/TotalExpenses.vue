<script setup>
import { computed } from "vue";
import DoughnutChart from "./DoughnutChart.vue";

const props = defineProps({
  expenses: Array,
  month: Number,
  year: Number,
});

// Colors for the doughnut to display
const categoryColors = {
  groceries: "#bbf7d0",
  food: "#fecaca",
  living: "#fef08a",
  entertainment: "#e9d5ff",
  travel: "#bfdbfe",
  other: "#e5e7eb",
};

// Compute the total expenses for each category
const categoryTotals = computed(() => {
  const totals = {};
  props.expenses.forEach((expense) => {
    const cat = expense.category || "Uncategorized";
    if (!totals[cat]) totals[cat] = 0;
    totals[cat] += expense.price;
  });
  return totals;
});

// Sort categories by total expenses in descending order
const sortedCategories = computed(() =>
  Object.entries(categoryTotals.value).sort((a, b) => b[1] - a[1])
);

// Doughnught chart data, labels, and colors
const chartData = computed(() =>
  sortedCategories.value.map(([, total]) => total)
);
const chartLabels = computed(() =>
  sortedCategories.value.map(([category]) => category)
);
const chartColors = computed(() =>
  chartLabels.value.map((cat) => categoryColors[cat.toLowerCase()] || "#818cf8")
);
</script>

<template>
  <div>
    <DoughnutChart
      :labels="chartLabels"
      :data="chartData"
      :colors="chartColors"
      :month="month"
      :year="year"
    />
  </div>
</template>
