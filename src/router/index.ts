// Composables
import { createRouter, createWebHistory, RouteLocationNormalized, NavigationGuardNext } from "vue-router";
import { auth } from '../firebase/config';

const requireAuth = (to:RouteLocationNormalized, from:RouteLocationNormalized, next: NavigationGuardNext) => {
  const user = auth.currentUser;

  if (!user) {
    next({name: 'Login'});
  } else {
    next();
  }
}


const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Layout.vue"),
    children: [
      {
        path: "",
        name: "Home",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
      },
    ],
    beforeEnter: requireAuth,
  },
  {
    path: "/login",
    component: () => import("@/layouts/login/Layout.vue"),
    children: [
      {
        path: "",
        name: "Login",
        component: () => import("@/views/Login.vue"),
      },
    ],
  },
  {
    path: "/Signup",
    component: () => import("@/layouts/login/Layout.vue"),
    children: [
      {
        path: "",
        name: "Signup",
        component: () => import("@/views/Signup.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// handle dynamic import errors
router.onError((error, to) => {
  if (
    error.message.includes("Failed to fetch dynamically imported module") ||
    error.message.includes("Importing a module script failed")
  ) {
    if (!to?.fullPath) {
      window.location.reload();
    } else {
      // @ts-ignore
      window.location = to.fullPath;
    }
  }
});

export default router;
