<script setup lang="ts">

import { GithubAuthProvider, getAuth, signInWithRedirect } from 'firebase/auth'
const { t } = useI18n()

const auth = getAuth()
const ghProvider = new GithubAuthProvider()
const loginGH = () => signInWithRedirect(auth, ghProvider)
</script>

<template>
  <div>
    <p class="text-4xl">
      <carbon-pedestrian class="inline-block" /> {{ auth.currentUser?.email }}
    </p>
    <p>
      {{ t('login.title') }}
    </p>

    <div>
      <button
        class="btn m-3 text-sm mt-6"
        @click="loginGH"
      >
        {{ t('button.github') }}
      </button>
    </div>
  </div>
</template>
