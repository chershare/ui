<script setup lang="ts">
import axios from 'axios'

import { onMounted } from 'vue'

import { useSettingsStore } from '@/stores/settings'
import { useResourceResultsStore } from '@/stores/resource-results'

const settings = useSettingsStore()
const resourceResults = useResourceResultsStore()

function getResources() {
  const url = settings.mediaServerUrl + '/' + 'resources'
  axios.get(url)
    .then((res: any) => {
      resourceResults.results = res.data.map((row: any) => ({
        title: row.title, 
        description: row.description
      }))
    })
}

onMounted(() => {
  getResources() 
})

</script>

<template>
  <div class="bookings">
    <h1>bookings</h1>
  </div>
  <div class="results">
    <div class="resource" v-for="resource in resourceResults.results">
      <h3> {{ resource.title }} </h3>
      <p> {{ resource.description }} </p>
    </div>
  </div>
</template>

<style>
</style>
