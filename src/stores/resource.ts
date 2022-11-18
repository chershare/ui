import { defineStore } from "pinia";

interface Booking {
  start: number, 
  end: number, 
}

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
