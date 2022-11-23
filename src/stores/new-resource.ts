import { defineStore } from "pinia";
import Near from 'near-api-js'

// in the user interface we deal with weeks and minutes and stuff
// on the contract side of things there are only milliseconds, only time stamps
export type TimeUnit = 'Seconds' | 'Minutes' | 'Hours' | 'Days' | 'Weeks' | 'Months' | 'Years' 
export const timeDurations = {
  Seconds: 1000, 
  Minutes: 1000 * 60,
  Hours: 1000 * 60 * 60, 
  Days: 1000 * 60 * 60 * 24, 
  Weeks: 1000 * 60 * 60 * 24 * 7, 
  Months: 1000 * 60 * 60 * 24 * 30.437, 
  Years: 1000 * 60 * 60 * 24 * 365.25, 
} as {[key: string]: number}

const initalState = {
  name: "", 
  title: "",
  description: "", 
  imageUrls: [] as string[], 
  contactInfo: "", 
  tags: [] as string[], 
  pricing: {
    unit: 'Days' as TimeUnit, 
    cancellationUnit: 'Days' as TimeUnit, 
    nearPerUnit: '0', 
    nearPerBooking: '0',
    fullRefundPeriod: 7
  }, 
  minDuration: 1, 
  minDurationUnit: 'Days', 
  coordinates: [0,0]
}


export type State = typeof initalState

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}

export const useNewResourceStore = defineStore("new-resource", {
  state: () => initalState, 
  getters: {
  }
})
