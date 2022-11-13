import { defineStore } from "pinia";

const initalState = {
  dateRange: undefined as undefined | [number, number], 
}

export type State = typeof initalState

export const useNewBookingStore = defineStore("new-resource", {
  state: () => initalState, 
  getters: {
  }
})
