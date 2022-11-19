import { defineStore } from "pinia";

export interface Booking { // conform to db
  resource_name: string, 
  booker_account_id: string, 
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
