import { createRouter, createWebHistory } from "vue-router";
import Overview from "../views/Overview.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "overview",
      component: Overview,
    },
    {
      path: "/res/create",
      name: "createRes",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/CreateRes.vue"),
    },
    {
      path: "/res/manage/:resId",
      name: "manageRes",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/ManageRes.vue"),
    },
    {
      path: "/res",
      name: "resources",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/Resources.vue"),
    },
    {
      path: "/bookings/:id?",
      name: "bookings",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/MyBookings.vue"),
    },
  ],
});

export default router;
