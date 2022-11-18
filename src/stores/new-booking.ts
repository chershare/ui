import { defineStore } from "pinia";

interface State {
  dates? : [number, number], 
  exactPrice? : BigInt
}

export const useNewBookingStore = defineStore("new-booking", {
  state: () => ({} as State),  
  getters: {
  }
})
