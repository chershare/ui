<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";

import { onMounted } from 'vue'

import Header from "./components/Header.vue";

import { useNearStore } from './stores/near'

const near = useNearStore()

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

    <div class=near>
      <h2>NEAR connection</h2>
      <ul>
      <li> Account Id: {{ near.accountId }} </li>
      <li> Test message: {{ near.testMessage }} </li>
      </ul>
      <button v-if="near.signedIn" @click=near.signOut>
        sign out
      </button>
      <button v-else @click=near.signIn>
        sign in
      </button>
      <button @click=near.getTestMessage>
        query test message
      </button>
    </div>

    <div class="links">
      <nav>
        <RouterLink :to="{ path: '/' }">Overview</RouterLink>
        <RouterLink :to="{ name: 'create-resource' }">Create Resource</RouterLink>
        <RouterLink :to="{ name: 'resources' }">Browse Resource</RouterLink>
        <template v-if="near.accountId">
          <RouterLink :to="{ name: 'resources', query: { owner: near.accountId } }" >My Resources</RouterLink>
          <RouterLink :to="{ name: 'bookings', query: { booker: near.accountId } }">My Bookings</RouterLink>
        </template>
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

/* {
  outline: 1px solid #0ff4; 
  background-color: #f0f1; 
} /**/

html {
  background-color: #242424; 
  color: white; 
  font-family: sans-serif; 
  padding: 1rem; 
}

.logo {
  border-radius:50%; 
  margin: 1rem; 
  margin-bottom: 2rem; 
}
.near {
  display: inline-block; 
  vertical-align: top; 
}

@interactive: {
  padding: 0.5rem;
  margin: 0.2rem; 
  border-radius: 0.5rem; 
  border: none; 
  outline: none; 
  color: white; 
  background-color: #000; 
}; 

input, select, textarea {
  @interactive(); 
  border: 2px solid #fff8; 
  &:focus {
    outline: 2px solid white; 
  }
}

button {
  @interactive(); 
  font-size: 1.0em; 
  background-color: #fff4; 
  cursor: pointer; 
  &:hover, &:focus {
    background-color: #fff8; 
  }
}


nav {
  a {
    display: inline-block; 
    @interactive(); 
    color: #fff; 
  }
  a + a {
    margin-left: 0.5rem;
  }
}

a {
  color: #9af; 
}

</style>
