<script setup lang=ts>
import { useNearStore } from '@/stores/near'
const near = useNearStore()
</script>

<template>
  <div class="overview">
    <h1>CherShare</h1>
    <h2>Rent and rent out any resources.</h2>

		<div class=section>
      <h3>Rent resources</h3>
      <p>
        A holiday home, a place for a party, a projector, or a mobile sawmill, 
        whatever you need, there is a good chance, you will find it on Chershare.
      </p>
      <RouterLink :to="{ name: 'resource-browser' }">Search for a resource</RouterLink>

    </div>
		<div class=section>
      <h3>Share resources</h3>
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
      <RouterLink v-if="near.accountId !== undefined" :to="{ name: 'create-resource' }" >Create a resource</RouterLink>
      <RouterLink v-else :to="{ name: 'profile' }" >Log in to Near before creating a resource</RouterLink>
    </div>
		<div class=section>
      <h3>Manage resources</h3>
      <template v-if="near.accountId !== undefined">
        <p>If you are already sharing resources, you can find them</p>
        <RouterLink  :to="{ name: 'my-resources', query: { owner: near.accountId} }">here</RouterLink>
      </template>
      <RouterLink v-else :to="{ name: 'profile' }" >Log in to Near before managing a resource</RouterLink>

    </div>
		<div class=section>
      <h3>Manage bookings</h3>
      <template v-if="near.accountId !== undefined">
      <p>If you have booked resources, you can view your bookings </p>
      <RouterLink v-if="near.accountId !== undefined" :to="{ name: 'my-bookings', query: { booker: near.accountId } }">here</RouterLink>
      </template>
      <RouterLink v-else :to="{ name: 'profile' }" >Log in to Near before managing your bookings</RouterLink>
    </div>
  </div>
</template>

<style scss scoped>
</style>
