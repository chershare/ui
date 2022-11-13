import { defineStore } from "pinia";

export interface Quote {
  accurate: boolean, // TODO: only if from blockchain, otherwise prefix "~"
  begin: number, 
  end: number, 
}

export interface Resource {
  name: string, 
  title: string,  
  description: string,
  contactInfo: string, 
  quotes: Quote[], 
  priceTerm: string, 
  titleImage: string | undefined // one of the images get's returned from the database
  imagesUrls: string[]
  tagList: string
}

const initialState = {
  data: {} as {[name: string]: Resource}
}

type State = typeof initialState

export const useResourcesStore = defineStore("resources-store", {
  state: () => initialState, 
});
