import { defineStore } from "pinia";

export type PricingType = 'SimpleRent' | 'LinearRefund'

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
  contact: "", 
  pricing: {
    type: 'LinearRefund' as PricingType, 
    simpleRent: {
      microNearPerSecond: 1000
    }, 
    linearRefund: {
      unit: 'Days' as TimeUnit, 
      nearPerUnit: 1, 
      fixedPriceInNear: 0, 
      refundBufferInUnits: 7
    }
  }
}

export type State = typeof initalState

export const useNewResourceStore = defineStore("new-resource", {
  state: () => initalState, 
  getters: {
    contractFormatPricing(state: State) : any {
      let o = {}
      switch(state.pricing.type) {
        case 'LinearRefund': 
          let p = state.pricing.linearRefund
          o = {
            price_fixed_base: p.fixedPriceInNear * 10 ** 24, 
            price_per_ms: p.nearPerUnit * 10 ** 24 / timeDurations[p.unit], 
            refund_buffer: p.refundBufferInUnits * timeDurations[p.unit] 
          }
          break; 
        default: 
          o = {
            price_per_ms: state.pricing.simpleRent.microNearPerSecond 
              / 1000 // per millisecond
              * 10 ** (24 - 6), // from micro to yocta NEAR
          }
      }
      return {
        [state.pricing.type]: o
      }
    },
  }
})
