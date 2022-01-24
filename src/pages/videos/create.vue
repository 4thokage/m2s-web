<script setup lang="ts">
import * as midiPkg from '@tonejs/midi'
import { createFFmpeg } from '@ffmpeg/ffmpeg'
import { computed, ref } from 'vue'

const { t } = useI18n()
const { Midi } = midiPkg
const ffmpeg = createFFmpeg({ log: true })
const midi = ref(new Midi().toJSON())
const isMidiLoaded = computed(() => midi.value.tracks.length > 0)

const onChangeMidiFile = (e: any) => {
  Midi.fromUrl(URL.createObjectURL(e.target?.files[0])).then((data) => {
    if (data) midi.value = data.toJSON()
  })
}

const isCreationEnabled = ref(false)

const onChangeInstrument = (_e: Event) => {
  isCreationEnabled.value = true
}

const onCreateVideo = (_e: any) => {
  if (!ffmpeg.isLoaded()) ffmpeg.load()
}

const instruments = [{ name: 'DEMO', id: 1 }]

</script>

<template>
  <div>
    <p class="text-4xl">
      <carbon-dicom-overlay class="inline-block" />
      {{ t('create.warning') }}
    </p>

    <div class="py-4" />

    <label class="px-4" for="midiFile">{{ t('midi.upload') }}</label>
    <input type="file" name="midiFile" accept=".mid" required @change="onChangeMidiFile">
    <div class="py-2" />
    <div v-if="isMidiLoaded">
      <div v-if="isMidiLoaded" class="bg-purple-700 opacity-60 py-px-4 rounded">
        {{ t('midi.header_name') }}: {{ midi.header.name || "_" }}
        {{ t('midi.tracks') }}: {{ midi.tracks.length }}
      </div>
      <div class="py-2" />
      <label class="px-4" for="instrumentSelect">{{ t('midi.configure_instruments') }}</label>
      <select class="form-control" name="instrumentSelect" @change="onChangeInstrument($event)">
        <option value selected disabled>
          Choose
        </option>
        <option
          v-for="instrument in instruments"
          :key="instrument.id"
          :value="instrument.id"
        >
          {{ instrument.name }}
        </option>
      </select>
      <div>
        <button class="m-3 text-sm btn-alt" :disabled="true">
          {{ t('button.add_instrument') }}
        </button>
      </div>
    </div>
    <div class="py-2" />
    <div>
      <div>
        <button class="m-3 text-sm btn" :disabled="!isCreationEnabled" @click="onCreateVideo">
          {{ t('button.create') }}
        </button>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
