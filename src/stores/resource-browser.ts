import { defineStore } from "pinia";

const initialState = {
  filters: {
    owner: undefined as string | undefined, 
    tags: [],
    location: {
      coordindates: undefined as [number, number] | undefined, 
      radius: 10 // unit: km
    }, 
    price: {
      min: undefined as number | undefined, 
      max: undefined as number | undefined
    },
    dates: undefined as [number, number] | undefined,
    // search: "", // no full text search for now
  }, 
  results: [] as string[] // ids that point to the resources store
}

type State = typeof initialState

export const useResourceBrowserStore = defineStore("resource-browser", {
  state: () => initialState, 
});
