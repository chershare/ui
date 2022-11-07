import { ref } from "vue";
import { defineStore } from "pinia";

interface Resource {
  name: string, 
  title: string,  
  description: string,
  contact: string, 
  quote: number, 
  priceTerm: string
}

export const useResourceResultsStore = defineStore("resource-results", () => {
  return { 
    results: [] as Resource[]
  };
});
