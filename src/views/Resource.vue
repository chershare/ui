<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue' 

import * as NEAR from 'near-api-js'

import { useSettingsStore } from '@/stores/settings'
import { useNewBookingStore } from '@/stores/new-booking'
import { useNearStore } from '@/stores/near'
import { useResourcesStore } from '@/stores/resources'
import { useResourceStore } from '@/stores/resource'

import type { Booking } from '@/api-types'

import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import config from '@/config'
import { computed } from '@vue/reactivity'

const settings = useSettingsStore()
const newBooking = useNewBookingStore()
const near = useNearStore()
const resources = useResourcesStore()
const resource = useResourceStore()

const props = defineProps({
  resourceName: {
    type: String, 
    required: true
  }
})

let selectedImage = ref(0)

onMounted(() => {
  getBaseInfo()
  getImages()
  getQuote()
  let now = new Date()
  getBookingsForCalendar({
    instance: 0, 
    month: now.getMonth(), 
    year: now.getFullYear()
  }) 
})

const baseInfo = computed(() => 
  resources.data[props.resourceName]
) 

const humanReadablePrice = computed(() => {
  if(newBooking.exactPrice !== undefined) {
    return NEAR.utils.format.formatNearAmount(newBooking.exactPrice.toString())
  } else {
    return "choose date range to see a price" 
  }
})

const resourceContractAccountId = computed(() => 
  props.resourceName + "." + config.contract
)

let loadResourceErrors = ref([] as string[]) 
function getBaseInfo() {
  console.log("get base info", baseInfo.value, props.resourceName) 
  if(baseInfo.value == undefined && props.resourceName) {
    resources.loadResource(props.resourceName) 
  }
}

const loadingPrice = ref(0) 
function getQuote() {
  console.log("ask for prices.") 
  newBooking.exactPrice = undefined
  if(newBooking.dates && props.resourceName) {
    console.log("calling book on contract", resourceContractAccountId.value) 
    loadingPrice.value++
    near.viewMethod(
      resourceContractAccountId.value, 
      "get_quote",  // TODO implement smart contract function
      { 
        start: newBooking.dates[0] , 
        end: newBooking.dates[1] 
      }
    ).then((result: any) => {
      console.log(loadingPrice.value) 
      if(loadingPrice.value > 1) {
        console.log("skipping old price quote response") 
      } else {
        newBooking.exactPrice = BigInt(result)
      }
    }).finally(() => {
      loadingPrice.value--
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

let bookingErrors = ref([] as string[])

function book() {
  bookingErrors.value = []
  if(newBooking.dates == undefined) {
    bookingErrors.value.push("No date selected") 
  } else if (newBooking.exactPrice == undefined) {
    bookingErrors.value.push("Exact booking price not known. Try again!") 
  } else {
    // TODO: check for collisions
    if(bookingErrors.value.length == 0) {
      const args = {
        start: newBooking.dates[0], 
        end: newBooking.dates[1], 
      } 
      console.log("send book contract call", args) 
      near.callMethod(
        resourceContractAccountId.value, 
        "book",  
        args, 
        30, 
        newBooking.exactPrice.toString()
      ).then(() => console.log("success"))
      .catch(e => console.error("something failed", e) )
    }
  }
}

let fullyBlockedDays = ref({} as {[date: number]: boolean}) // counts how many bookings are there
let partiallyBlockedDays = ref({} as {[date: number]: boolean}) 

function getBookings(from: number, until: number) {
  console.log("get bookings") 
  if(props.resourceName) {
    const query = new URLSearchParams({
      from: from.toString(), 
      until: until.toString()
    }) 
    const url = settings.mediaServerUrl + '/resources/' + props.resourceName + '/bookings?' + query.toString()
    console.log("requesting bookings", url) 
    axios.get<Booking[]>(url)
      .then((res) => {
        if(typeof(res.data) == 'string') {
          loadResourceErrors.value.push("could not load bookings: " + res.data) 
        } else if(res.data) {
          fullyBlockedDays 
          resource.bookings = res.data 
          res.data.forEach(booking => {
            blockDays(
              Math.max(from, booking.start), 
              Math.min(booking.end, until)
            ) 
          }) 
        }
      })
    }
}

// okay, we have to make one thing clear here: "end" means the first ms that is not part of the booking. 
function blockDays(start: number, end: number) {
  let startDate = new Date(start) 
  
  let day = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
  let isPartially = day.getTime() !== start

  day.setDate(day.getDate() + 1) 

  while(day.getTime() < end) {
    if(isPartially) {
      partiallyBlockedDays.value[day.getTime()] = true
      isPartially = false
    } else {
      fullyBlockedDays.value[day.getTime()] = true
    }
    day.setDate(day.getDate() + 1) 
  }

  isPartially ||= day.getTime() !== end

  if(isPartially) {
    partiallyBlockedDays.value[day.getTime()] = true
  } else {
    fullyBlockedDays.value[day.getTime()] = true
  }
}

function getBookingsForCalendar(args: {
  instance: number, 
  month: number, 
  year: number
}) {
  let ersterTag = new Date(args.year, args.month, 1) 
  let from = new Date(ersterTag.getTime()) 
  from.setDate(from.getDate() - 7) 
  let until = new Date(ersterTag.getTime())
  until.setMonth(until.getMonth() + 1) 
  until.setDate(until.getDate() + 7) 
  getBookings(from.getTime(), until.getTime())
}

function fullyBlocked(date: Date) {
  let dayStart = date.getTime()
  let dateEnd = new Date(date)
  dateEnd.setDate(dateEnd.getDate() + 1)
  let dayEnd = dateEnd.getTime()
  for(let booking of resource.bookings) {
    console.log("booking.start", booking.start) 
    console.log("day start", dayStart) 
    if(booking.start <= dayStart && booking.end >= dayEnd) {
      return true
    } 
  }
  return false
}

function partiallyBlocked(d: string) {
  return false
}

</script>

<template>
  <p v-if='loadResourceErrors.length > 0'>
    <ul class=errors>
      <li v-for="error, key in loadResourceErrors" :key=key>
        {{ error }}
      </li>
    </ul>
  </p>
  <p v-else-if="baseInfo == undefined"> 
      loading resource ...
  </p>
  <template v-else>
    <h3>{{baseInfo.name}}</h3>
    <div class="tags">
      <span class=tag v-for="tag, i in baseInfo.tagList.split(',')" :key=i>
        {{tag}}
      </span>
    </div>
    <p>{{ baseInfo.description }}</p>
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
      @update-month-year=getBookingsForCalendar
      text-input>
      <template #day="{ day, date }">
        <div v-if="fullyBlockedDays[date.getTime()]" class='blockBg fully'>
        </div>
        <div v-else-if="partiallyBlockedDays[date.getTime()]" class='blockBg partially'>
        </div>
        {{ day }}
      </template>
    </Datepicker>
  </template>
  <p> price: {{ humanReadablePrice }} </p>
  <button @click=book> 
    book
  </button>
  <h3>debug</h3>
  bookings: 
  <div v-for="booking in resource.bookings">
    {{ booking }}
  </div>
  <p>
    dates:  
    {{ newBooking.dates }}
  </p>
  <p>
    image urls: {{ resource.imageUrls }}
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

.blockBg {
  position: absolute; 
  top: 0; 
  left: 0; 
  height: 100%; 
  width: 100%; 
  &.fully {
    background-color: #f005; 
  }
  &.partially{
    background-color: #f803; 
  }
}
</style>
