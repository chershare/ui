<script setup lang=ts>
import ResourceImageUpload from '../components/ResourceImageUpload.vue'

import { useNewResourceStore } from '@/stores/new-resource'

const newResourceStore = useNewResourceStore()

</script>

<template>
  <div class="createRes">
    <h1>Create Res</h1>
    <div>
      <h3>Images</h3>
      <p>Upload some photos or blueprints of the resource you are sharing.</p>
      <div class=imagePreview>
        <ResourceImageUpload />
      </div>
    </div>
    <h3>Title and Description</h3>
    <p>Choose a title and describe the resource you are sharing.</p>
    <input v-model=newResourceStore.title type=text placeholder=Title />
    <textarea v-model=newResourceStore.description placeholder=Description />
    
  </div>
</template>

<style>
</style>
