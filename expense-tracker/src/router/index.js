import { createRouter, createWebHistory } from "vue-router";
import { supabase } from "../utils/supabase";

import HomeView from "../views/HomeView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import AddExpenseView from "../views/AddExpenseView.vue";
import EditExpenseView from "../views/EditExpenseView.vue";
import LogInView from "../views/LogInView.vue";
import RegisterView from "../views/RegisterView.vue";
import MonthView from "../views/MonthView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: LogInView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/expenses",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/expenses/:year/:month",
      name: "expenses-by-date",
      component: MonthView,
    },

    {
      path: "/expenses/add",
      name: "add-expense",
      component: AddExpenseView,
    },
    {
      path: "/expenses/edit/:id",
      name: "edit-expense",
      component: EditExpenseView,
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

// Navigation guard to check if user is authenticated
router.beforeEach(async (to, from, next) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is logged in and tries to access "/", redirect to "/expenses"
  if (to.path === "/") {
    if (user) {
      return next("/expenses");
    }
    return next();
  }

  // Protect /expenses and all subroutes
  if (to.path.startsWith("/expenses")) {
    if (!user) {
      return next("/");
    }
  }

  next();
});

export default router;
