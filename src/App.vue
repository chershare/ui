<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";

import { onMounted, ref } from 'vue'

import { useRouter } from 'vue-router'

import { useNearStore } from './stores/near'

const near = useNearStore()
const router = useRouter()
const route = useRoute()

onMounted(() => {
  near.startUp()
})

function goTo(name: string) {
  router.push({ name }) 
}

const routeNames = [
  "overview",
  "profile",
  "resource-browser",
  "create-resource",
  "my-resources",
  "my-bookings",
]

</script>

<template>
  <div id=chershare-content>
    <RouterView />
    <div class=spacer />
  </div>

  <div id=chershare-shadow />
  <div id=chershare-menu>
    <button v-for="routeName of routeNames" 
      :key=routeName
      @click="goTo(routeName)"
      :class="{ [routeName]: true, selected: route.name == routeName}" />
  </div>
</template>

<style lang=less>

/* {
  outline: 1px solid #0ff4; 
  background-color: #f0f1; 
} /* debug */

html {
  background-color: #242424; 
  color: white; 
  font-family: sans-serif; 
  padding: 0; 
}

body {
  margin: 0.5rem; 
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
  border-radius: 0.5rem; 
  border: none; 
  outline: none; 
  color: white; 
  background-color: #000; 
}; 

input, select, textarea {
  font-family: sans-serif; 
  font-size: 1em; 
  @interactive(); 
  border: 2px solid #fff8; 
  &:focus {
    outline: 2px solid white; 
  }
}

button {
  @interactive(); 
  padding: 1rem; 
  border-radius: 1rem; 
  font-size: 1.0em; 
  background-color: #fff3; 
  cursor: pointer; 
  &:hover, &:focus {
    background-color: #fff7; 
  }
  & + & {
    margin-left: 0.5rem;
  }
}

a {
  color: #8cf; 
  &:visited {
    color: #eae; 
  }
}

h1 {
  line-height: 3rem; 
  margin: 1rem 0 ; 
  padding: 0; 
}

#chershare-menu {
  position: fixed; 
  button {
    margin: 0; 
    border-radius: 0; 
    background-color: #fff; 
    background-size: 65%; 
    background-repeat: no-repeat; 
    background-position: center; 
    box-shadow: 0 1rem 1rem black; 
    transform: translate(0, 0); 
    transition: transform 0.2s ease-out, background-color 0.2s ease-out, box-shadow 0.2s ease-out; 
    &.selected {
      background-color: #aaa; 
      box-shadow: 0 0 0 black; 
    }
  }
}

@media (min-aspect-ratio: 2/3) {
  #chershare-content {
    @lrmargin: 1rem; 
    margin-left: calc(10vh + @lrmargin); 
    margin-right: @lrmargin; 
    margin-bottom: 3rem; 
    max-width: 90vh; 
  }
  #chershare-menu {
    top: 5rem; 
    left: 0; 
    button {
      display:block; 
      @size: 10vh; 
      width: @size; 
      height: @size;  
      border-top-right-radius: 4vh; 
      border-bottom-right-radius: 4vh; 
      margin-top: -1px; 
      &.selected {
        transform: translate(-0.5rem, 0); 
        height: calc(@size - 0.3rem); 
      }
    }
  }
  #chershare-shadow {
    display: none; 
  }
}
  
/* mobile */
@media (max-aspect-ratio: 2/3) {
  #chershare-content {
    margin: 0.2rem; 
    .spacer {
      height: calc(100vw / 4); 
    }
  }

  #chershare-menu {
    bottom: 0; 
    left: 0; 
    button {
      @size: calc(100vw / 6);
      vertical-align:bottom; 
      width: @size; 
      height: @size;  
      margin: 0; 
      border-radius: 0; 
      border-top-right-radius: 4vw; 
      border-top-left-radius: 4vw; 
      background-color: #fff; 
      background-size: 65%; 
      background-repeat: no-repeat; 
      background-position: center; 
      box-shadow: 0 1rem 1rem black; 
      transform: translate(0, 0); 
      transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out; 
      &.selected {
        transform: translate(0, 0.5rem); 
        background-color: #999; 
        height: calc(@size - 0.3rem); 
        box-shadow: 0 0 0 black; 
      }
    }
  }

  #chershare-shadow {
    position: fixed; 
    bottom: 0; 
    left: 0; 
    height: calc(100vw / 5); 
    width: 100vw; 
    background-image: linear-gradient(#0000, #000a, #000f); 
  }
}

#chershare-menu {
  .profile {
    background-image: url('@/assets/menu-icons/near.svg'); 
  }
  .overview {
    background-image: url('assets/logo.png'); 
  }
  .create-resource {
    background-image: url('assets/menu-icons/create-resource.svg') 
  }
  .resource-browser {
    background-image: url('assets/menu-icons/browse-resources.svg') 
  }
  .my-resources {
    background-image: url('assets/menu-icons/my-resources.svg') 
  }
  .my-bookings {
    background-image: url('assets/menu-icons/my-bookings.svg');
  }
}

.error {
  color: #f35; 
}


</style>
