<script setup lang=ts>
import ResourceImageUpload from '../components/ResourceImageUpload.vue'

import { useNewResourceStore } from '@/stores/new-resources'
import { useNearStore } from '@/stores/near'

import config from '@/config.ts'

import { v4 as uuidv4 } from 'uuid'

const newResource = useNewResourceStore()
const near = useNearStore()

function createResourceOnChain() {
  console.log("creating resource") 
  near.callMethod(
    config.contract, 
    "create_resource", // pricing model simple rent
    {
      id: uuidv4(), 
      name: newResource.name ?? '', 
      description: newResource.description ?? '', 
      price_per_ms: newResource.pricing.simpleRent.microNearPerSecond 
        / 1000 // per millisecond
        * 10 ** (24 - 6) // from micro to yocta NEAR
    } 
  ).then(() => console.log("success"))
  .catch(e => console.error("something failed", e) )
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
      <textarea v-model=newResource.description placeholder=Description />
      </p>
      <h3>Pricing</h3>
      <p>
      <input v-model.number=newResource.pricing.simpleRent.microNearPerSecond type=text placeholder="micro NEAR per second"/> micro NEAR per second 
      </p>
      {{newResource}}
      <button @click=createResourceOnChain>Create Resource On Chain</button>
    </div>
    
  </div>
</template>

<style>
</style>
