<script setup lang="ts">
const isGuestModeEnabled = true

const router = useRouter()
const login = () => router.push('/auth/login')
const create = () => router.push('/videos/create?mode=guest')

const { t } = useI18n()
</script>

<template>
  <p class="m-3 text-lg font-bold">
    {{ t('home.intro') }}
  </p>

  <p class="m-3 text-base">
    {{ t('home.description') }}
  </p>
  <div>
    <div>
      <button class="m-3 text-sm btn" @click="login">
        {{ t('button.login') }}
      </button>
    </div>
    <div>
      <button class="btn-alt m-3 text-sm" :disabled="!isGuestModeEnabled" @click="create">
        {{ t('button.create') }}
      </button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
