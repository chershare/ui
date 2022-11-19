<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue' 

import { useSettingsStore } from '@/stores/settings'
import { useNewResourceStore } from '@/stores/new-resource'

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
  loading = false
}

</script>

<template>
  <input @change="fileChange" type="file" accept="image/*" multiple :hidden="loading">
  <div>
    <div class=uploadedImage v-for="url, i in imageUrls" :key=i :style="{backgroundImage: 'url('+url+')'}"
      @click="editImage = url">
      <template v-if="url == editImage"> 
        <button @click.stop="editImage = ''" class='top left'> ok </button>
        <button @click.stop="imageUrls.splice(i,1)" class='top right'> remove </button>
        <button @click.stop="(i > 0) && ([imageUrls[i-1], imageUrls[i]] = [imageUrls[i], imageUrls[i-1]])" class='bottom left'> shift left </button>
        <button @click.stop="(i + 1 < imageUrls.length) && ([imageUrls[i+1], imageUrls[i]] = [imageUrls[i], imageUrls[i+1]])" class='bottom right'> shift right </button>
      </template>
    </div>
  </div>
</template>

<style lang=less scoped>
.uploadedImage {
  position: relative;
  display: inline-block;
  width: calc(50% - 1rem); 
  padding: 0; 
  padding-top: calc(50% - 1rem);
  margin: 0.5rem; 
  border-radius: 0.5rem; 
  background-size: contain; 
  background-repeat: no-repeat; 
  background-position: center; 
  background-color: #555;
  border: 0; 
  button {
    background-color: #000b;
    position: absolute; 
    width: 40%; 
    height: 40%; 
    border-radius: 0.5rem; 
    border: none; 
    display: inline-block; 
    &.top{
      top:5%; 
    }
    &.bottom {
      bottom:5%; 
    }
    &.left {
      left: 5%; 
    }
    &.right {
      right: 5%; 
    }
  }
}
</style>
