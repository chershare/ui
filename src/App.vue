<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import Header from "./components/Header.vue";

import { Wallet } from './near-wallet'; 

const wallet = new Wallet({ createAccessKeyFor: process.env.CONTRACT_NAME })

function onMounted(callback: () => void): void {
  console.log("trying to start wallet") 
  wallet.startUp()
}

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
