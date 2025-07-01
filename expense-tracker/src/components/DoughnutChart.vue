<script setup>
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(Title, Tooltip, Legend, ArcElement, annotationPlugin);

const props = defineProps({
  labels: Array,
  data: Array,
  colors: Array,
  month: Number,
  year: Number,
});

const monthName = new Date(Date.UTC(props.year, props.month, 1)).toLocaleString(
  "default",
  { month: "long" }
);
</script>

<template>
  <div style="max-width: 250px; margin: 0 auto">
    <Doughnut
      :data="{
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderWidth: 1,
          },
        ],
      }"
      :options="{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          annotation: {
            annotations: {
              dLabel: {
                type: 'doughnutLabel',
                content: ({ chart }) => [
                  `$${chart.getDatasetMeta(0).total.toFixed(2)}`,
                  `${monthName}, ${props.year}`,
                ],
                font: [{ size: 24 }, { size: 18 }],
                color: ['#000', '#555'],
              },
            },
          },
        },
      }"
      :width="200"
      :height="200"
    />
  </div>
</template>
