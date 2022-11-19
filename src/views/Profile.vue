<script setup lang="ts">
import { useNearStore } from '@/stores/near'

const near = useNearStore()

</script>

<template>
  <div class=near>
    <h2>NEAR connection</h2>
    <ul>
    <li> Account Id: {{ near.accountId }} </li>
    <li> Test message: {{ near.testMessage }} </li>
    </ul>
    <button v-if="near.signedIn" @click=near.signOut>
      sign out
    </button>
    <button v-else @click=near.signIn>
      sign in
    </button>
    <button @click=near.getTestMessage>
      query test message
    </button>
  </div>
</template>
