import { defineStore } from "pinia";

export interface Resource {
  name: string, 
  title: string,  
  description: string,
  contactInfo: string, 
  approximatePrice: number | undefined, 
  priceTerm: string, 
  titleImage: string | undefined // one of the images get's returned from the database
  imageUrls: string[]
  tagList: string
}

const initialState = {
  data: {} as {[name: string]: Resource}
}

type State = typeof initialState

export const useResourcesStore = defineStore("resources-store", {
  state: () => initialState, 
});
