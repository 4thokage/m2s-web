<script setup lang="ts">
import * as midiPkg from '@tonejs/midi'
import { createFFmpeg } from '@ffmpeg/ffmpeg'
import { computed, ref } from 'vue'
import { useDropzone } from 'vue3-dropzone'

const { t } = useI18n()
const { Midi } = midiPkg
const ffmpeg = createFFmpeg({
  log: true,
})
const midi = ref<midiPkg.MidiJSON>()
midi.value = {
  tracks: [],
  header: {
    name: 'sample',
    ppq: 0,
    meta: [],
    tempos: [],
    timeSignatures: [],
    keySignatures: [],
  },
}
const isCreationEnabled = ref(false)
const isMidiLoaded = computed(() => midi.value.tracks.length > 0)
const tracksWithNotes = computed(() => midi.value.tracks.filter(t => t.notes.length > 0))

function onChangeMidiFile(acceptFiles: any, _rejectReasons: any) {
  Midi.fromUrl(URL.createObjectURL(acceptFiles[0])).then((data) => {
    if (data)
      midi.value = data.toJSON()
  })
}

const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({ accept: '.mid', maxFiles: 1, onDrop: onChangeMidiFile })

function onChangeInstrument(_e: Event) {
  isCreationEnabled.value = true
}

function onCreateVideo(_e: any) {
  if (!ffmpeg.loaded)
    ffmpeg.load()
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
    <div class="py-1" />
    <div class="cursor-pointer border-1 border-purple-700 border-dotted border-solid" v-bind="getRootProps()">
      <input name="midiFile" v-bind="getInputProps()">
      <p v-if="isDragActive">
        {{ t('dropzone.drag') }}
      </p>
      <p v-else>
        {{ t('dropzone.drop') }}
      </p>
      <p v-if="acceptedFiles.length > 0">
        {{ t('dropzone.accept') }}
      </p>
    </div>
    <div class="py-2" />
    <div v-if="isMidiLoaded">
      <div v-if="isMidiLoaded" class="py-px-4 flex-col rounded bg-purple-700 text-white opacity-50">
        <p> {{ midi.header.name || t('midi.header_name_empty') }}</p>
        <p>{{ t('midi.tracks') }}: {{ tracksWithNotes.length }}</p>
      </div>
      <div class="py-4" />
      <label class="px-4" for="instrumentSelect">{{ t('midi.configure_instruments') }}</label>
      <div class="py-1" />
      <div v-for="track in tracksWithNotes" :key="track.name" name="instrumentSelect" class="grid grid-cols-3 py-1">
        <p class="align-middle">
          {{ track.name || t('midi.header_name_empty') }}
        </p>
        <select class="text-black" @change="onChangeInstrument($event)">
          <option value="-1" selected>
            {{ t('button.disabled') }}
          </option>
          <option
            v-for="instrument in instruments"
            :key="instrument.id"
            :value="instrument.id"
          >
            {{ instrument.name }}
          </option>
        </select>
        <div class="text-left">
          <carbon-add class="inline-block" />
        </div>
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
