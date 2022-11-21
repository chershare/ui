<script lang=ts setup>
import ResourceListVue from '@/components/ResourceList.vue'
import { useNearStore } from '@/stores/near'

const near = useNearStore()

</script>

<template>
  <h1>My Resources</h1>
  <ResourceListVue
    v-if="near.accountId !== undefined"
    :owner=near.accountId
    />
  <p v-else class=error>
    Log in to Near, in order to see your resources.  
  </p>
</template>

<style lang=less scoped>
</style>
