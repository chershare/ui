import { defineStore } from "pinia";
import { Booking } from '@/api-types'

interface State {
  imageUrls: string[], 
  bookings: Booking[], 
}

const initialState: State = {
  imageUrls: ['test'], 
  bookings: [], 
} 

export const useResourceStore = defineStore("resource-store", {
  state: () => initialState, 
});
