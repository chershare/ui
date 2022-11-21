import { defineStore } from "pinia";
import axios from 'axios'

import { useSettingsStore } from './settings'

const settings = useSettingsStore()

export interface Resource {
  name: string, 
  title: string,  
  description: string,
  contactInfo: string, 
  approximatePrice: number | undefined, 
  priceTerm: string, 
  titleImage: string | undefined // one of the images get's returned from the database
  imageUrls: string[]
  tagList: Set<string>
}

const initialState = {
  data: {} as {[name: string]: Resource}
}

type State = typeof initialState

export const useResourcesStore = defineStore("resources-store", {
  state: () => initialState, 
  actions: {
    loadResource(resourceName: string) {
      console.log("requesting") 
      const url = settings.mediaServerUrl + '/' + 'resources' + "/" + resourceName
      axios.get(url)
        .then((res) => {
          if(res.data) {
            let row = res.data
            this.data[row.name] = {
              name: row.name,  
              title: row.title, 
              description: row.description, 
              contactInfo: row.contactInfo, 

              imageUrls: [row.titleImage] || [], 
              titleImage: row.titleImage, 

              approximatePrice: row.price, 

              priceTerm: "",

              tagList: new Set(row.tagList.split(',')), 
            }
            console.log(JSON.stringify(this.data) )
          }
        })
    }
  }
});
