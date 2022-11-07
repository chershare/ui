<script setup lang=ts>
import ResourceImageUpload from '../components/ResourceImageUpload.vue'

import { useNewResourceStore, timeDurations } from '@/stores/new-resources'
import { useNearStore } from '@/stores/near'

import config from '@/config'

// import { v4 as uuidv4 } from 'uuid'
import { ref } from 'vue'

const newResource = useNewResourceStore()
const near = useNearStore()

const errors = ref([] as string[])

function createResourceOnChain() {
  errors.value = []
  if(newResource.name == "") {
    errors.value.push("You need to provide a name") 
  }
  if(errors.value.length == 0) {
    const args = {
      name: newResource.name, 
      resource_init_params: {
        title: newResource.title ?? '', 
        description: newResource.description ?? '', 
        contact: newResource.contact,
        pricing: newResource.contractFormatPricing, 
        coordinates: [0,0], // TODO use geocoding
        min_duration_ms: newResource.minDuration * timeDurations[newResource.minDurationUnit], 
        image_urls: newResource.imageUrls, 
        tags: newResource.tags, 
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
      <input v-model=newResource.title type=text placeholder=title />
      <textarea v-model=newResource.description placeholder=Description />
      <h3>Contact information</h3>
      <p>How shall people contact you when renting this resource?</p>
      <textarea v-model=newResource.contact placeholder="Contact data"/>
      <h3>Minimum booking duration</h3>
      <p>What's the minimum period that the resource can be rented for?</p>
      <input v-model.number=newResource.minDuration type=text placeholder="micro NEAR per second"/> 
      <select v-model=newResource.minDurationUnit>
        <option v-for="_value, u in timeDurations" :value='u'>{{u}}</option>
      </select>
      <h3>Pricing</h3>
      <select v-model=newResource.pricing.type>
        <option value="SimpleRent">SimpleRent</option>
        <option value="LinearRefund">LinearRefund</option>
      </select>
      <div v-if="newResource.pricing.type == 'SimpleRent'">
        <input v-model.number=newResource.pricing.SimpleRent.microNearPerSecond type=text placeholder="micro NEAR per second"/> micro NEAR per second 
      </div>
      <div v-if="newResource.pricing.type == 'LinearRefund'">
        <select v-model=newResource.pricing.LinearRefund.unit>
          <option v-for="value, u in timeDurations" :value='u'>{{u}}</option>
        </select>
        {{ timeDurations }}
        <p>
        price per {{newResource.pricing.LinearRefund.unit}} 
        <input v-model.number=newResource.pricing.LinearRefund.nearPerUnit type=text placeholder="micro NEAR per second"/> 
        </p>
        fixed price per booking in NEAR
        <input v-model.number=newResource.pricing.LinearRefund.fixedPriceInNear type=text placeholder="micro NEAR per second"/> 
{{newResource.pricing.LinearRefund.unit}} of free cancelation
        <input v-model.number=newResource.pricing.LinearRefund.refundBufferInUnits type=text placeholder="micro NEAR per second"/> 
      </div>
      <p>
      </p>
      {{newResource}}
      <h3>Name</h3>
      <p>Choose a name for your resource.</p>
      <input v-model=newResource.name type=text placeholder=title />
      <ul>
        <li v-for="error in errors"> {{ error }} </li>
      </ul>
      <button @click=createResourceOnChain>Create Resource On Chain</button>
    </div>
  </div>
</template>

<style>
</style>

