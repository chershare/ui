import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useSettingsStore = defineStore("counter", () => {
  const mediaServerUrl = ref("http://localhost:8000");
  // const doubleCount = computed(() => count.value * 2);
  // function increment() {
  //   count.value++;
  // }

  return { 
    mediaServerUrl 
  };
});
