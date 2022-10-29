import { ref } from "vue";
import { defineStore } from "pinia";

interface Resource {
  title: string,  
  description: string,
}

export const useResourceResultsStore = defineStore("resource-results", () => {
  return { 
    results: [] as Resource[]
  };
});
