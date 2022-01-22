import { getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { ref } from 'vue'
import { whenever } from '@vueuse/core'
import { useAuth } from '@vueuse/firebase'
import type { UserModule } from '~/types'

const {
  VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_APP_ID,
  VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_MEASUREMENT_ID,
  VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID,
} = import.meta.env

export const isFirebaseInit = ref(false)

export const install: UserModule = ({ router, isClient }) => {
  if (!isClient)
    return

  if (getApps().length === 0) {
    getAuth(initializeApp({
      apiKey: VITE_FIREBASE_API_KEY?.toString(),
      authDomain: VITE_FIREBASE_AUTH_DOMAIN?.toString(),
      projectId: VITE_FIREBASE_PROJECT_ID?.toString(),
      storageBucket: VITE_FIREBASE_STORAGE_BUCKET?.toString(),
      messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID?.toString(),
      appId: VITE_FIREBASE_APP_ID?.toString(),
      measurementId: VITE_FIREBASE_MEASUREMENT_ID?.toString(),
    })).onAuthStateChanged(() => isFirebaseInit.value = true)
  }
  /**
   * Router Hooks
   */
  router.beforeEach(async(to) => {
    whenever(isFirebaseInit, () => {
      const guestAuth: any = { value: true }
      const isAuthenticated = (typeof to.meta.authenticate === 'boolean' && to.meta.authenticate) ? useAuth() : guestAuth

      if (to.name === 'auth-login' && isAuthenticated.value)
        return '/'

      if (to.meta.authenticate && to.name !== 'auth-login' && !isAuthenticated.value)
      // eslint-disable-next-line @typescript-eslint/indent
      return { name: 'auth-login' }
    })
  })
}
