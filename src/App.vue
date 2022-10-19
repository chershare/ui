<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";

import { onMounted } from 'vue'

import Header from "./components/Header.vue";

import { useNear } from './stores/near'

const near = useNear()

onMounted(() => {
  near.startUp()
})

</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.png"
      width="125"
      height="125"
    />

    <button v-if="near.signedIn" @click=near.signOut>
      sign out
    </button>
    <button v-else @click=near.signIn>
      sign in
    </button>

    <h3>near info</h3>
    <p> ... </p>
      

    <div class="links">
      <nav>
        <RouterLink to="/">Overview</RouterLink>
        <RouterLink to="/res/create">Create Resource</RouterLink>
        <RouterLink to="/res/manage/asd">Manage Resource</RouterLink>
        <RouterLink to="/bookings">Bookings</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style lang=less>

/* body {
  background-color: #211; 
  color: #fbf; 
}

a {
  color: #88f; 
}

input {
  background-color: #000; 
} */

</style>
