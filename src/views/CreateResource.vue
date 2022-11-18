<script setup lang=ts>
import ResourceImageUpload from '../components/ResourceImageUpload.vue'

import { useNewResourceStore, timeDurations } from '@/stores/new-resource'
import { useNearStore } from '@/stores/near'
 
import * as NEAR from 'near-api-js'

import config from '@/config'

// import { v4 as uuidv4 } from 'uuid'
import { ref } from 'vue'

const newResource = useNewResourceStore()
const near = useNearStore()

const errors = ref([] as string[])

async function createResourceOnChain() {
  errors.value = []
  if(newResource.name == "") {
    errors.value.push("You need to provide a name") 
  }
  let nameExists = await near.viewMethod(
    config.contract, 
    "name_exists", 
    { name: newResource.name }
  ) 
  if(nameExists) {
    errors.value.push("This name is already taken") 
  }
  const yoctoPerBooking = NEAR.utils.format.parseNearAmount(newResource.pricing.nearPerBooking)
  const yoctoPerUnit = NEAR.utils.format.parseNearAmount(newResource.pricing.nearPerUnit) 
  if(yoctoPerUnit == null) {
    errors.value.push("failed to parse NEAR amount per time unit") 
  }
  if(yoctoPerBooking == null) {
    errors.value.push("failed to parse NEAR amount per booking") 
  }
  if(errors.value.length == 0) {
    const args = {
      name: newResource.name, 
      resource_init_params: {
        title: newResource.title, 
        description: newResource.description, 
        image_urls: [...newResource.imageUrls], 
        contact: newResource.contactInfo,
        tags: newResource.tags, 
        pricing: {
          price_per_booking: yoctoPerBooking,
          price_per_ms: BigInt(yoctoPerUnit!) / BigInt(timeDurations[newResource.pricing.unit]),  
          full_refund_period_ms: newResource.pricing.fullRefundPeriod * timeDurations[newResource.minDurationUnit] 
        }, 
        coordinates: newResource.coordinates, // TODO use geocoding
        min_duration_ms: newResource.minDuration * timeDurations[newResource.minDurationUnit], 
      }
    } 
    console.log("creating resource", args) 
    near.callMethod(
      config.contract, 
      "create_resource",  
      args, 
      238 + 5, // TODO: found this number by testing manually. Strange thing is: only 151 tgas are actually used but cant go below 225 here 0.o
      "3" + "0".repeat(24)
    ).then(() => console.log("success"))
    .catch(e => console.error("something failed", e) )
  }
}

let tagInput = ref(null)
function addTag(e: Event) {
  let el = e.target as HTMLInputElement
  let tag = el.value.trim()
  if(tag !== "" && !newResource.tags.some(a => a == tag)) {
    newResource.tags.push(tag) 
    el.value = ""
  }
}
function popTag(e: Event) {
  let el = e.target as HTMLInputElement
  if(el.value == "") {
    newResource.tags.pop()
  }
}

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
      <h3>Title and Description</h3>
      <p>Choose a title and describe the resource you are sharing.</p>
      <p>
        <input v-model=newResource.title type=text placeholder=title />
      </p>
      <p>
        <textarea v-model=newResource.description placeholder=Description />
      </p>
      <h3>Tags</h3>
      <p>Choose tags that describe the type of this resource</p>
      <div class="tagInput">
        <div class=tag v-for="tag, key in newResource.tags" :key=key>
          {{ tag }} 
          <div class="delete" @click="newResource.tags.splice(key, 1)">x</div>
        </div>
        <input 
          ref="tagInput" 
          @change="addTag" 
          @keydown.backspace="popTag" 
          type=text />
      </div>
      <h3>Pricing</h3>
      Unit: <select v-model=newResource.pricing.unit>
        <option v-for="_ms, unit in timeDurations" :value='unit'>{{unit}}</option>
      </select>
      <p>
        Price in NEAR per {{ newResource.pricing.unit.toLowerCase() }}: 
        <input v-model=newResource.pricing.nearPerUnit type=text placeholder="NEAR per unit"/> 
      </p>
      <p>
        Fixed price per booking in NEAR: 
        <input v-model=newResource.pricing.nearPerBooking type=text placeholder="NEAR per booking"/> 
      </p>
      <p>
        100% <b>refund</b>
        <input v-model.number=newResource.pricing.fullRefundPeriod type=text placeholder=""/> 
        {{newResource.pricing.unit.toLowerCase()}} before booking starts. <br/>
        Linear decline from there to 0% at booking start. 
      </p>
      <h3>Minimum booking duration</h3>
      <p>What's the minimum period that the resource can be rented for?</p>
      <p>
        <input v-model.number=newResource.minDuration type=text placeholder="0"/> 
        <select v-model=newResource.minDurationUnit>
          <option v-for="_ms, unit in timeDurations" :value='unit'>{{unit}}</option>
        </select>
      </p>
      <h3>Contact information</h3>
      <p>How shall people contact you when renting this resource?</p>
      <p>
        <textarea v-model=newResource.contactInfo placeholder="Contact data"/>
      </p>
      <h3>Name</h3>
      <p>Choose a name for your resource.</p>
      <input v-model=newResource.name type=text placeholder=title />
      <ul>
        <li v-for="error in errors"> {{ error }} </li>
      </ul>
      <button @click=createResourceOnChain>Create Resource On Chain</button>
      <p>debug: <pre>{{JSON.stringify(newResource.$state, null, '  ')}}</pre></p>
    </div>
  </div>
</template>

<style lang=less scoped>
@delSize: 2rem; 
@tagHeight: 2rem; 

.tagInput {
  .tag{
    display: inline-block; 
    position: relative; 
    height: @tagHeight; 
    line-height: @tagHeight; 
    margin: 0.2rem; 
    padding: 0.25rem; 
    padding-right: @delSize + 0.5rem; 
    padding-left: 1rem; 
    border-radius: 1rem; 
    background-color: #fff2; 
    .delete {
      position: absolute; 
      right: 0.25rem; 
      top: 0.25rem; 
      text-align: center; 
      cursor: pointer; 
      width: @delSize; 
      height: @delSize; 
    }
  }
}

</style>

