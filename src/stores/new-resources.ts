import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useNewResourceStore = defineStore("new-resource", () => {
  const title = ref("")
  const description = ref("")
  const imageUrls = ref([] as string[])

  // example compute or function
  // const doubleCount = computed(() => count.value * 2)
  // function increment() {
  //   count.value++;
  // }

  return { 
    title,
    description, 
    imageUrls, 
    pricing: {
      simpleRent: {
        microNearPerSecond: 1000
      }
    }
  };
});
