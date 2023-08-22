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
        class="m-3 mt-6 text-sm btn"
        @click="loginGH"
      >
        {{ t('button.github') }}
      </button>
    </div>
  </div>
</template>
