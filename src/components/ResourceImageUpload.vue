<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue' 

import { useSettingsStore } from '@/stores/settings'
import { useNewResourceStore } from '@/stores/new-resources'

// import UploadedImage from './UpoadedImage.vue'

const settings = useSettingsStore()
const newResource = useNewResourceStore()

const imageUrls = newResource.imageUrls

let errors = ref([] as string[])
let editImage = ref("")

let loading = false; 

async function fileChange(event: Event) {
  console.log("called") 
  loading = true
  let files = (event.target as HTMLInputElement).files
  if(files) {
    for(var i = 0; i < files.length; i++){
      let formData = new FormData()
      formData.set('image', files[i])
      try {
        const url = settings.mediaServerUrl + '/' + 'resource-images'
        console.log(url) 
        const response = await axios.post(url, formData) as any
        console.log("response: ", response.data) 
        if(response.data.ok) {
          newResource.imageUrls.push(url + '/' + response.data.relativeUrl) 
        } else {
          errors.value.push(response.data.error)
        }
      } catch(e) {
        console.log("failed and catched") 
        console.log(e) 
        errors.value.push(String(e))
      }
    }
  }
  // loading = false
}

</script>

<template>
  <div class=uploadedImage v-for="url, i in imageUrls" :key=i :style="{backgroundImage: 'url('+url+')'}"
    @click="editImage = url">
    <template v-if="url == editImage"> 
      <button @click.stop="editImage = ''" class='top left'> ok </button>
      <button @click.stop="imageUrls.splice(i,1)" class='top right'> remove </button>
      <button @click.stop="(i > 0) && ([imageUrls[i-1], imageUrls[i]] = [imageUrls[i], imageUrls[i-1]])" class='bottom left'> shift left </button>
      <button @click.stop="(i + 1 < imageUrls.length) && ([imageUrls[i+1], imageUrls[i]] = [imageUrls[i], imageUrls[i+1]])" class='bottom right'> shift right </button>
    </template>
  </div>
  <input @change="fileChange" type="file" accept="image/*" multiple :hidden="loading">
</template>

<style lang=less scoped>
.uploadedImage {
  position: relative;
  display: inline-block;
  min-height: 9rem; 
  min-width: 9rem; 
  margin: 0.5rem; 
  border-radius: 0.5rem; 
  background-size: contain; 
  background-repeat: no-repeat; 
  background-position: center; 
  background-color: #555;
  padding: 0; 
  border: 0; 
  button {
    position: absolute; 
    width: 4.0rem; 
    height: 4.0rem; 
    border-radius: 0.5rem; 
    border: none; 
    display: inline-block; 
    &.top{
      top:0.33rem; 
    }
    &.bottom {
      bottom:0.33rem; 
    }
    &.left {
      left: 0.33rem; 
    }
    &.right {
      right: 0.33rem; 
    }
  }
}
</style>
