<script setup lang="ts">
import axios from 'axios'
import { onBeforeMount, onMounted, ref, type PropType } from 'vue' 

import * as NEAR from 'near-api-js'

import { useSettingsStore } from '@/stores/settings'
import { useNewBookingStore } from '@/stores/new-booking'
import { useNearStore } from '@/stores/near'
import { useResourcesStore } from '@/stores/resources'
import { useResourceStore } from '@/stores/resource'
import { useResourceBrowserStore } from '@/stores/resource-browser'

import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import config from '@/config'
import { computed } from '@vue/reactivity'
import { useRoute } from 'vue-router'

const settings = useSettingsStore()
const newBooking = useNewBookingStore()
const near = useNearStore()
const resources = useResourcesStore()
const resource = useResourceStore()
const resourceBrowser = useResourceBrowserStore() 

const props = defineProps({
  resourceName: {
    type: String, 
    required: true
  }
})

const route = useRoute()

let selectedImage = ref(0)

onMounted(() => {
  getBaseInfo()
  getImages()
  getQuote()
  getBookings()
})

const baseInfo = computed(() => 
  resources.data[props.resourceName]
) 

const humanReadablePrice = computed(() => {
  if(resource.exactPrice !== undefined) {
    return NEAR.utils.format.formatNearAmount(resource.exactPrice.toString())
  } else {
    return "choose date range to see a price" 
  }
})

// const contractAccountId = computed(() => 
//   props.resourceName + "." + config.contract
// )

function getBaseInfo() {
  console.log("get base info", baseInfo.value, props.resourceName) 
  if(baseInfo.value == undefined && props.resourceName) {
    console.log("requesting") 
    const url = settings.mediaServerUrl + '/' + 'resources' + "/" + props.resourceName
    axios.get(url)
      .then((res) => {
        if(res.data) {
          let row = res.data
          resources.data[row.name] = {
            name: row.name,  
            title: row.title, 
            description: row.description, 
            contactInfo: row.contactInfo, 

            imageUrls: [row.titleImage] || [], 
            titleImage: row.titleImage, 

            approximatePrice: row.price, 

            priceTerm: "",

            tagList: row.tagList, 
          }
        }
      })
    }
}

function getQuote() {
  console.log("ask for prices") 
  if(newBooking.dates && props.resourceName) {
    let contactAccountId = props.resourceName + "." +  config.contract
    near.viewMethod(
      contactAccountId, 
      "get_quote",  // TODO implement smart contract function
      { 
        start: newBooking.dates[0] , 
        end: newBooking.dates[1] 
      }
    ).then((result: any) => {
      resource.exactPrice = BigInt(result)
    })
  }
}

function getImages() {
  console.log("get images") 
  if(props.resourceName) {
    const url = settings.mediaServerUrl + '/resources/' + props.resourceName + '/images' 
    console.log("requesting images", url) 
    axios.get(url)
      .then((res) => {
        console.log(res) 
        if(res.data) {
          resource.imageUrls = res.data.map((row: any) => row.image_url) 
        }
      })
    }
}

function getBookings() {
  // TODO load bookings from mediaserver
  console.log("get bookings") 
  if(props.resourceName) {
    const url = settings.mediaServerUrl + '/resources/' + props.resourceName + '/bookings' 
    console.log("requesting bookings", url) 
    axios.get(url)
      .then((res) => {
        if(res.data) {
          let rows = res.data 
          resource.bookings = rows
        }
      })
    }
}

</script>

<template>
  <p v-if="baseInfo == undefined"> 
    loading resource ...
  </p>
  <template v-else>
    <h3>{{baseInfo.name}}</h3>
    <div class="tags">
      <span class=tag v-for="tag, i in baseInfo.tagList.split(',')" :key=i>
        {{tag}}
      </span>
    </div>
    <p>{{baseInfo.description}}</p>
    <div class='gallery'>
      <div class=thumbnail  v-for="imgUrl, key in resource.imageUrls" :key=key 
        :class="{selected: key == selectedImage}"
        @click='selectedImage = key'
        :style="{backgroundImage: 'url('+imgUrl+')'}"/>
    </div>
    <div class='bigImage' :style="{backgroundImage: `url(${resource.imageUrls[selectedImage]})`}" />
    <h2> booking </h2>
    choose a date: 
    <Datepicker 
      v-model="newBooking.dates" 
      model-type="timestamp"
      range
      dark
      enable-seconds
      is24
      :start-time="{hours: 12, minutes:0, seconds: 0}"
      @update:model-value=getQuote()
      text-input />
  </template>
  <p> price: {{ humanReadablePrice }} </p>
  <div v-for="booking in resource.bookings">
    {{ booking }}
  </div>
  <button> 
    book
  </button>
  <p>
    dates:  
    {{ newBooking.dates}}
  </p>
  <p>
    image urls: {{ resource.imageUrls}}
  </p>
  <p>
    bookings: {{ resource.bookings }}
  </p>
</template>

<style lang=less scoped>
.gallery {
  .thumbnail {
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
    &.selected {
      outline: 3px solid white;
    }
  }
}
.bigImage {
  width: 100%; 
  padding-bottom: 100%; 
  background-position: center; 
  background-size: contain; 
  background-repeat: no-repeat; 
  background-color: #555;
}

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
</style>
