import { createApp } from "vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import "./style.css";
import router from "./router";
import App from "./App.vue";

const app = createApp(App);
app.component("Datepicker", VueDatePicker);
app.use(Toast, {
  timeout: 2500,
});
app.use(router);
app.mount("#app");
