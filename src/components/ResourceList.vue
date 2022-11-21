<script lang=ts setup>
import axios from 'axios'

import { onMounted, watch, type PropType } from 'vue'

import { useSettingsStore } from '@/stores/settings'
import { useResourceBrowserStore } from '@/stores/resource-browser'
import { useResourcesStore } from '@/stores/resources'

import { computed } from '@vue/reactivity'
import router from '@/router'

const settings = useSettingsStore()
const resourceBrowser = useResourceBrowserStore()
const resources = useResourcesStore()

const props = defineProps({
  owner: {
    type: String, 
    required: false, 
  }, 
  tags: {
    type: Array as PropType<string[]>, 
    required: false, 
  }
  // TBD: more filters
}) 

watch(props, () => {
  getResources()
})
// TODO pagination (once people use this dapp) 

function getResources() {
  const query = new URLSearchParams() 
  if(props.owner) {
    query.append("owner", props.owner) 
  }
  if(props.tags) {
    props.tags.forEach(tag => query.append("tags", tag))
  }
  const url = settings.mediaServerUrl + '/' + 'resources?' + query.toString()
  axios.get(url)
    .then((res: any) => {
      res.data.forEach((row: any) => {
        resources.data[row.name] = {
          name: row.name,  
          title: row.title, 
          description: row.description, 
          contactInfo: row.contactInfo, 

          imageUrls: [row.titleImage], 
          titleImage: row.titleImage, 

          priceTerm: "",

          approximatePrice: row.price, 

          tagList: new Set(row.tagList.toString().split(','))
        }
      })
      resourceBrowser.results = res.data.map((row: any) => row.name) 
    })
}

function showDetails(resourceName: string) {
  router.push({
    path: "/resources/" + resourceName,
    name: "resource", 
    params: { resourceName }, 
    query: { dates: resourceBrowser.filters.dates }
  })
}


onMounted(() => {
  getResources() 
})

const resourceResults = computed(() => resourceBrowser.results.map((resName: string) => resources.data[resName])) 
</script>

<template>
  <div class="results">
    <div class="resource" 
      v-for="resource in resourceResults" 
      @click="showDetails(resource.name)" 
      :key=resource.name>
      <div class="title" :style="`background-image:url('${resource.titleImage}')`">
        <div class=gradient-box>
          <h2> {{ resource.title }} </h2>
        </div>
      </div>
      <div class="details">
        <div class="tags">
          Tags: <span class=tag v-for="tag, i in resource.tagList" :key=i>
            {{tag}}
          </span>
        </div>
        <p> {{ resource.description }} </p>
      </div>
    </div>
  </div>
</template>

<style lang=less scoped>
@resColor: #333f; 
.resource {
  border-radius: 1rem; 
  box-shadow: 0 0 1.2rem #000; 
  transition: box-shadow 0.1s ease-out; 
  &:hover {
    box-shadow: 0 0 0.5rem #000; 
  }
  overflow: hidden; 
  .title {
    position: relative; 
    max-width: 100%; 
    padding: 33%; 
    background-size: cover; 
    background-repeat: none; 
    background-position: center; 
    .gradient-box {
      position: absolute; 
      bottom: 0; 
      left: 0; 
      width: 100%; 
      background-image: linear-gradient(#0000, @resColor);
      h2 {
        padding: 1rem; 
        padding-top: 10rem;
        margin: 0; 
      }
    }
  }
  .details {
    background-color: @resColor;
    padding: 1rem; 
    padding-top: 0; 
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
  }
  & + & {
    margin-top: 1rem; 
  }
}

</style>
