import { defineStore } from "pinia";

interface Booking {
  begin: number, 
  end: number, 
}

interface State {
  imageUrls: string[], 
  bookings: Booking[], 
  exactPrice? : BigInt
}

const initialState: State = {
  imageUrls: ['test'], 
  bookings: [], 
} 

export const useResourceStore = defineStore("resource-store", {
  state: () => initialState, 
});
