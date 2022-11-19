import { createRouter, createWebHistory } from "vue-router";
import Overview from "@/views/Overview.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "overview",
      component: Overview,
    },
    {
      path: "/profile",
      name: "profile",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/Profile.vue"),
    },
    {
      path: "/create",
      name: "create-resource",
      component: () => import("../views/CreateResource.vue"),
    },
    {
      path: "/resources/:resourceName",
      name: "resource",
      props: true, 
      component: () => import("../views/Resource.vue"),
    },
    {
      path: "/resources/:resourceName/manage",
      props: true, 
      name: "manage-resource",
      component: () => import("../views/ManageResource.vue"),
    },
    {
      path: "/resources",
      name: "resources",
      component: () => import("../views/Resources.vue"),
    },
    {
      path: "/bookings",
      name: "bookings",
      component: () => import("../views/MyBookings.vue"),
    },
  ],
});

export default router;
