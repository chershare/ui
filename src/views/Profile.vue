<script setup lang="ts">
import { useNearStore } from '@/stores/near'

const near = useNearStore()

</script>

<template>
  <h1>Your NEAR connection</h1>
  <div class=section>
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
