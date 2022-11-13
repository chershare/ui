import { defineStore } from "pinia";

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
    nearPerUnit: 1, 
    nearPerBooking: 0, 
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
    contractFormatPricing(state: State) : any {
      let unitMs = timeDurations[state.pricing.unit]
      return {
        price_per_booking: BigInt(state.pricing.nearPerBooking) * 10n ** 24n,
        price_per_ms: BigInt(state.pricing.nearPerUnit) * 10n ** 24n / BigInt(unitMs), 
        full_refund_period_ms: state.pricing.fullRefundPeriod * unitMs
      }
    },
  }
})
