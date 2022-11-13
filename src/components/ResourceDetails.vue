<script setup lang="ts">
import axios from 'axios'
import { ref, type PropType } from 'vue' 

import { useSettingsStore } from '@/stores/settings'
import { useNewBookingStore } from '@/stores/new-booking'
import { useNearStore } from '@/stores/near'

import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import config from '@/config'

import type { Resource } from '@/stores/resource-browser'

// import UploadedImage from './UpoadedImage.vue'

const settings = useSettingsStore()
const newBooking = useNewBookingStore()
const near = useNearStore()

const props = defineProps({
  resource: {
    type: Object as PropType<Resource>, 
    required: true
  }, 
  range: {
    type: Object as PropType<[Number, Number]>
  }, 
})

let imageUrls = ref([props.resource.titleImage])
let selectedImage = ref(0)
let price = ref(0)

function getQuote() {
  let contactAccountId = props.resource.name + "." +  config.contract
  if(newBooking.dateRange) {
    let begin = newBooking.dateRange[0] 
    let end = newBooking.dateRange[1] 
    near.viewMethod(
      contactAccountId, 
      "getQuote",  // TODO implement smart contract function
      {begin, end}
    ).then((result: any) => {
      price.value = result
    })
  } 
}

</script>

<template>
  <h3>{{props.resource.name}}</h3>
  {{ imageUrls}}
  <img :src=imageUrls[selectedImage] >
  <img v-for="imgUrl, key in imageUrls" :key=key :src="imgUrl">
  <p>{{props.resource.description}}</p>
  <Datepicker 
    v-model="newBooking.dateRange" 
    model-type="timestamp"
    range 
    dark
    @change=getQuote()
    text-input />
  {{ newBooking.dateRange }}
</template>

<style lang=less scoped>
</style>
