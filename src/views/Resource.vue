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
    return NEAR.utils.format.formatNearAmount(newBooking.exactPrice.toString()) + " NEAR"
  } else {
    return "Choose dates in order to see a price quote." 
  }
})

const resourceContractAccountId = computed(() => 
  props.resourceName + "." + config.contract
)

let loadResourceErrors = ref([] as string[]) 
function getBaseInfo() {
  if(baseInfo.value == undefined && props.resourceName) {
    resources.loadResource(props.resourceName) 
  }
}

const loadingPrice = ref(0) 
function getQuote() {
  newBooking.exactPrice = undefined
  if(newBooking.dates && props.resourceName) {
    loadingPrice.value++
    near.viewMethod(
      resourceContractAccountId.value, 
      "get_quote",  // TODO implement smart contract function
      { 
        start: newBooking.dates[0] , 
        end: newBooking.dates[1] 
      }
    ).then((result: any) => {
      if(loadingPrice.value <= 1) {
        newBooking.exactPrice = BigInt(result)
      }
    }).finally(() => {
      loadingPrice.value--
    })
  }
}

function getImages() {
  if(props.resourceName) {
    const url = settings.mediaServerUrl + '/resources/' + props.resourceName + '/images' 
    axios.get(url)
      .then((res) => {
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
      near.callMethod(
        resourceContractAccountId.value, 
        "book",  
        args, 
        30, 
        newBooking.exactPrice.toString()
      )
    }
  }
}

let fullyBlockedDays = ref({} as {[date: number]: boolean}) // counts how many bookings are there
let partiallyBlockedDays = ref({} as {[date: number]: boolean}) 

function getBookings(from: number, until: number) {
  if(props.resourceName) {
    const query = new URLSearchParams({
      from: from.toString(), 
      until: until.toString()
    }) 
    const url = settings.mediaServerUrl + '/resources/' + props.resourceName + '/bookings?' + query.toString()
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

  let nextDay = new Date(day.getTime()) 
  nextDay.setDate(nextDay.getDate() + 1) 

  console.log(JSON.stringify({
    start, 
    end, 
    startDate, 
    day
  }), null, ' ')

  while(nextDay.getTime() < end) {
    console.log("day", day) 
    if(isPartially) {
      partiallyBlockedDays.value[day.getTime()] = true
      isPartially = false
    } else {
      fullyBlockedDays.value[day.getTime()] = true
    }
    day = new Date(nextDay.getTime()) // copy
    nextDay.setDate(nextDay.getDate() + 1)
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

</script>

<template>
  <h1>Resource details</h1>
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
    <div class=section>
      <h3>{{baseInfo.name}}</h3>
      <div class="tags">
        Tags: <span class=tag v-for="tag, i in baseInfo.tagList" :key=i>
          {{tag}}
        </span>
      </div>
      <p>{{ baseInfo.description }}</p>
    </div>
    <div class='gallery' v-if='resource.imageUrls.length > 1'>
      <div class=thumbnail  v-for="imgUrl, key in resource.imageUrls" :key=key 
        :class="{selected: key == selectedImage}"
        @click='selectedImage = key'
        :style="{backgroundImage: 'url('+imgUrl+')'}"/>
    </div>
    <div class='bigImage' :style="{backgroundImage: `url(${resource.imageUrls[selectedImage]})`}" />
    <div class=section>
      <h3>Contact</h3>
      <h4>{{ baseInfo.owner }}</h4>
      <p>
        {{ baseInfo.contactInfo }}
      </p>
    </div>
    <div class=section>
      <h3> booking </h3>
      <p>
      Choose a date: 
      </p>
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
      <p> Price: {{ humanReadablePrice }} </p>
      <button @click=book :disabled="newBooking.exactPrice == undefined" > 
        Book resource
      </button>
    </div>
  </template>
</template>

<style lang=less scoped>
.gallery {
  margin: 0.5rem -0.5rem; 
  .thumbnail {
    position: relative;
    display: inline-block;
    @size: calc(100% / 5 - 0.81rem);
    width: @size; 
    padding: 0; 
    padding-top: @size;

    margin: 0.2rem 0.4rem; 
    border-radius: 0.5rem; 
    background-size: contain; 
    background-repeat: no-repeat; 
    background-position: center; 
    background-color: #555;
    border: 0; 
    &.selected {
      outline: 3px solid white;
    }
  }
}
.bigImage {
  border-radius:0.5rem; 
  width: 100%; 
  padding-bottom: 100%; 
  background-position: center; 
  background-size: contain; 
  background-repeat: no-repeat; 
  background-color: #555;
  margin-bottom: 1rem; 
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
