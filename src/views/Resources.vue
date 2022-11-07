<script lang=ts setup>
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
  <div class="resources">
    <h1>Resources</h1>
    <div class="results">
      {{ resourceResults }}
      <div class="resource" v-for="resource in resourceResults.results">
        <h3> {{ resource.title }} </h3>
        <p> {{ resource.description }} </p>
      </div>
    </div>
  </div>
</template>

<style scss scoped>

</style>
