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
    // route level code-splitting
    // importing inline generates a separate chunk (About.[hash].js) for the routes
    // which is lazy-loaded when the route is visited.
    {
      path: "/profile",
      name: "profile",
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
      path: "/resources",
      name: "resource-browser",
      component: () => import("../views/ResourceBrowser.vue"),
    },
    {
      path: "/my-resources",
      name: "my-resources",
      component: () => import("../views/MyResources.vue"),
    },
    {
      path: "/my-bookings",
      name: "my-bookings",
      component: () => import("../views/MyBookings.vue"),
    },
  ],
});

export default router;
