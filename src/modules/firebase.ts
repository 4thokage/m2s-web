import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { ref } from 'vue'
import { whenever } from '@vueuse/core'
import { useAuth } from '@vueuse/firebase'

import type { UserModule } from '~/types'

export const isFirebaseInit = ref(false)

export const install: UserModule = ({ router }) => {
  try {
    const firebaseApp = initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASEURL,
      projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
      appId: import.meta.env.VITE_FIREBASE_APPID,
    })

    return firebaseApp
  }
  catch (error) {
    console.error({ error })
  }

  /**
   * Router Hooks
   */
  router.beforeEach(async (to) => {
    whenever(isFirebaseInit, () => {
      const guestAuth: any = { value: false }
      const isAuthenticated = (typeof to.meta.authenticate === 'boolean' && to.meta.authenticate) ? useAuth(getAuth()) : guestAuth

      if (to.name === 'auth-login' && isAuthenticated.value)
        return '/'

      if (to.meta.authenticate && to.name !== 'auth-login' && !isAuthenticated.value)
        return { name: 'auth-login' }
    })
  })
}
