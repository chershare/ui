import { ref, computed } from "vue";
import { defineStore } from "pinia";

import config from '@/config'

export const useSettingsStore = defineStore("settings", () => {
  const mediaServerUrl = ref(config.mediaServerDefaultHost);
  // const doubleCount = computed(() => count.value * 2);
  // function increment() {
  //   count.value++;
  // }

  return { 
    mediaServerUrl 
  };
});
