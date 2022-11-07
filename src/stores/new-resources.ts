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

const DEBUG = true

const initalState = DEBUG ? {
  name: "test", 
  title: "test",
  description: "just a test", 
  imageUrls: ["testurl"] as string[], 
  tags: ["test"],
  contact: "felix", 
  pricing: {
    type: 'LinearRefund' as PricingType, 
    SimpleRent: {
      microNearPerSecond: 1000
    }, 
    LinearRefund: {
      unit: 'Days' as TimeUnit, 
      nearPerUnit: 8, 
      fixedPriceInNear: 9, 
      refundBufferInUnits: 7
    }
  }, 
  minDurationUnit: 'Days' as TimeUnit, 
  minDuration: 1
} : {
  name: "", 
  title: "",
  description: "", 
  imageUrls: [] as string[], 
  contact: "", 
  tags: [] as string[], 
  pricing: {
    type: 'LinearRefund' as PricingType, 
    SimpleRent: {
      microNearPerSecond: 1000
    }, 
    LinearRefund: {
      unit: 'Days' as TimeUnit, 
      nearPerUnit: 1, 
      fixedPriceInNear: 0, 
      refundBufferInUnits: 7
    }
  }, 
  minDurationUnit: 'Days' as TimeUnit, 
  minDuration: 1
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
      let o = {}
      switch(state.pricing.type) {
        case 'LinearRefund': 
          let p = state.pricing.LinearRefund
          o = {
            price_fixed_base: BigInt(p.fixedPriceInNear) * 10n ** 24n,
            price_per_ms: BigInt(p.nearPerUnit) * 10n ** 24n / BigInt(timeDurations[p.unit]), 
            refund_buffer: p.refundBufferInUnits * timeDurations[p.unit]
          }
          break; 
        default: 
          o = {
            price_per_ms: BigInt(state.pricing.SimpleRent.microNearPerSecond 
              / 1000 // per millisecond
              * 10 ** (24 - 6)), // from micro to yocta NEAR
          }
      }
      return {
        [state.pricing.type]: o
      }
    },
  }
})
