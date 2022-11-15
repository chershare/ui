<script setup lang=ts>
import { useNearStore } from '@/stores/near'
const near = useNearStore()
</script>

<template>
  <div class="overview">
    <h1>Overview</h1>

    <h2>Share resources</h2>
    <p>
      If you have something valuable, 
      that you don't use youself all of the time, 
      you can share it with others and earn money for it. 
    </p>
    <p>
      Some examples for resources you could share are: 
    </p>
    <ul>
      <li>rooms or houses</li>
      <li>machines or tools</li>
      <li>cars, bikes and trailers</li>
    </ul>
    <p>
      Chershare makes the process of renting out resources as easy as possible. 
      Earn crypto by renting out your resources. 
    </p> 
    <RouterLink :to="{ name: 'create-resource' }" >Create a resource</RouterLink>

    <h2>Rent resources</h2>
    <p>
      A holiday home, a place for a party, a projector, or a mobile sawmill, 
      whatever you need, there is a good chance, you will find it on Chershare.
    </p>
    <RouterLink :to="{ name: 'resources' }">Search for a resource</RouterLink>

    <template v-if="near.accountId">
      <h2>Manage resources</h2>
      <p>If you are already sharing resources, you can find them</p>
      <RouterLink :to="{ name: 'resources', query: { owner: near.accountId} }">here</RouterLink>

      <h2>Manage bookings</h2>
      <p>If you have booked resources, you can view your bookings </p>
      <RouterLink :to="{ name: 'resources', query: { booker: near.accountId } }">here</RouterLink>
    </template>
    <p v-else> 
      <h2>Build NEAR</h2>
        <p>
          Chershare is built on laer 1 blockchain NEAR. 
        </p>
        <p>
          <a @click=near.signIn >Log in to NEAR</a> to get the full experience of this app. 
        </p>
    </p>
  </div>
</template>

<style scss scoped>
</style>
