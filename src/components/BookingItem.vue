<script setup lang="ts">
import type { Booking } from '@/api-types'
import { computed, type PropType } from 'vue'

import { useResourcesStore } from '@/stores/resources'

const resources = useResourcesStore() 

const props = defineProps({
  booking: {
    type: Object as PropType<Booking>, 
    required: true
  }
}) 

const resource = computed(() => {
  return resources.data[props.booking.resource_name]
}) 

const humanStart = computed(() => {
  return (new Date(props.booking.start)).toLocaleString()
}) 

const humanEnd = computed(() => {
  return (new Date(props.booking.end)).toLocaleString()
}) 

</script>


<template>
  <div class='booking'>
    <div v-if="resource !== undefined" class="title" :style="{ backgroundImage: `url(${resource.titleImage})`}">
      <div class=cancel>
        cancel booking
      </div>
      <div class='gradient-box'>
        <h2>{{resource.title}}</h2>
      </div>
    </div>
    <div class=details>
      {{ humanStart }} - {{ humanEnd }} 
    </div>
  </div>
</template>

<style lang=less scoped>
@resColor: #333; 
.booking {
  border-radius: 1rem; 
  box-shadow: 0 0 1.2rem #000; 
  transition: box-shadow 0.1s ease-out; 
  &:hover {
    box-shadow: 0 0 0.5rem #000; 
  }
  overflow: hidden; 
  .title {
    position: relative; 
    max-width: 100%; 
    padding: 10%; 
    height: 2rem; 
    background-size: cover; 
    background-repeat: none; 
    background-position: center; 
    .gradient-box {
      position: absolute; 
      bottom: 0; 
      left: 0; 
      width: 100%; 
      background-image: linear-gradient(#0000, @resColor);
      h2 {
        padding: 1rem; 
        width: 100%; 
        padding-top: 10%;
        margin: 0; 
      }
      pointer-events: none; 
    }
    .cancel{
      position: absolute; 
      cursor: pointer; 
      box-shadow: 0 0 1.2rem #000; 
      &:hover {
        box-shadow: 0 0 0.5rem #000; 
      }
      color: #fff; 
      border-radius: 0.5rem; 
      top: 1rem; 
      right: 1rem; 
      padding: 1rem; 
      background-color: #b04; 
    }
  }
  .details {
    background-color: @resColor;
    padding: 1rem; 
    padding-top: 0; 
    .tags {
      .tag {
        @tagHeight: 1rem; 
        /* copied from views/CreateRes.vue */
        display: inline-block; 
        position: relative; 
        height: @tagHeight; 
        line-height: @tagHeight; 
        margin: 0.2rem 0; 
        padding: 0.25rem 0.5rem; 
        border-radius: 1rem; 
        background-color: #fff2; 
      }
      .tag + .tag {
        margin-left: 0.2rem; 
      }
    }
  }
  & + & {
    margin-top: 1rem; 
  }
}
</style>