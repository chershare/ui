<script setup lang="ts">
import axios from 'axios'

import { useNearStore } from '@/stores/near'
import { useSettingsStore } from '@/stores/settings'

import type { Booking } from '@/api-types'
import { computed, onMounted, ref } from 'vue';

import BookingItem from '@/components/BookingItem.vue'
import { useResourcesStore } from '@/stores/resources';

const near = useNearStore()
const settings = useSettingsStore()

const loadResourceErrors = ref([] as string[])

const resources = useResourcesStore()
const myBookings = ref([] as Booking[])

const ordered = computed(() => {
  return [...myBookings.value].sort((a, b) => {
    return a.start - b.start
  })
}) 

function getBookings() {
  console.log("get bookings") 
  if(near.accountId) {
    const query = new URLSearchParams({
      accountId: near.accountId
    }) 
    const url = settings.mediaServerUrl + '/bookings?' + query.toString()
    console.log("requesting bookings", url) 
    axios.get<Booking[]>(url)
      .then((res) => {
        if(typeof(res.data) == 'string') {
          loadResourceErrors.value.push("could not load bookings: " + res.data) 
        } else if(res.data) {
          const bookings = res.data
          myBookings.value = bookings
          const resNames = new Set(bookings.map(b => b.resource_name))
          resNames.forEach(name => resources.loadResource(name)) 
        }
      })
    }
}

onMounted(getBookings)

</script>

<template>
  <p v-if='near.accountId == undefined'>
    log in to near to see your bookings
  </p>
  <div v-else class="bookings">
    <h1>My Bookings</h1>
    <BookingItem v-for='b, key in ordered' :key=key :booking=b />
  </div>
</template>

<style>
</style>
