<script setup lang=ts>
import ResourceImageUpload from '../components/ResourceImageUpload.vue'

import { useNewResourceStore } from '@/stores/new-resources'
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
        pricing: newResource.contractFormatPricing, 
        contact: newResource.contact,
      }
    } 
    console.log("creating resource", args) 
    near.callMethod(
      config.contract, 
      "create_resource", // pricing model simple rent
      args, 238 + 5 // TODO: found this number by testing manually. Strange thing is: only 151 tgas are actually used but cant go below 225 here 0.o
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
      <p>
      <input v-model=newResource.title type=text placeholder=title />
      <textarea v-model=newResource.description placeholder=Description />
      </p>
      <h3>Contact information</h3>
      <p>How shall people contact you when renting this resource?</p>
      <p>
      <textarea v-model=newResource.contact placeholder="Contact data"/>
      </p>
      <h3>Pricing</h3>
      <select v-model=newResource.pricing.type>
        <option value="SimpleRent">SimpleRent</option>
        <option value="LinearRefund">LinearRefund</option>
      </select>
      <div v-if="newResource.pricing.type == 'SimpleRent'">
        <input v-model.number=newResource.pricing.simpleRent.microNearPerSecond type=text placeholder="micro NEAR per second"/> micro NEAR per second 
      </div>
      <div v-if="newResource.pricing.type == 'LinearRefund'">
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

