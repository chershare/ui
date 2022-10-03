<script setup lang="ts">
import axios from 'axios'

import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()

let props = defineProps<{
  imgType: string
}>();

interface UploadedImage {
  url: string
  previewUrl: string
}

let loading = false; 

let images: UploadedImage[] = []; 
let errors: string[] = []; 

async function fileChange(event: Event) {
  console.log("called") 
  loading = true
  let files = (event.target as HTMLInputElement).files
  if(files) {
    for(var i = 0; i < files.length; i++){
      let formData = new FormData()
      formData.set('image', files[i])
      try {
        const url = settingsStore.mediaServerUrl + '/' + props.imgType + '-images'
        console.log(url) 
        const response = await axios.post(url, formData) as any
        console.log("response: ", response) 
        if(response.ok) {
          images.push(response.data) 
        } else {
          errors.push(response.error)
        }
      } catch(e) {
        console.log("failed and catched") 
        console.log(e) 
        errors.push(String(e))
      }
    }
  }
  // loading = false
}

</script>

<template>
  {{ images }}
  {{ loading }}
  <input @change="fileChange" type="file" accept="image/*" multiple :hidden="loading">
  {{ errors }}
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
