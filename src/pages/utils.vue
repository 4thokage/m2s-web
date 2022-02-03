<script setup lang="ts">
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import { computed, ref } from 'vue'
import NProgress from 'nprogress'

const { t } = useI18n()
const ffmpeg = createFFmpeg({ log: true })
const file = ref('')
const operation = ref('')
const isProcessing = ref(false)

if (!ffmpeg.isLoaded()) ffmpeg.load()

const onChangeFile = (e: any) => {
  file.value = e.target?.files.item(0)
}

const onChangeOperation = (e: any) => {
  operation.value = e.target.value
}

const customCommand = ref('')

const isExecutionAvailable = computed(() => file.value && !isProcessing.value)

const onClickExecute = async(_e: any) => {
  if (!ffmpeg.isLoaded()) return

  // Write the file to memory
  isProcessing.value = true
  NProgress.start()
  ffmpeg.FS('writeFile', 'source', await fetchFile(file.value))

  let type = 'application/octet-stream'
  if (customCommand.value !== '') {
    const [, ...ffmpegArgs] = customCommand.value.split(/(\s+)/)
    await ffmpeg.run(...ffmpegArgs)
  }
  else {
    switch (operation.value) {
      case 'mp3':
        type = 'audio/mpeg'
        await ffmpeg.run('-i', 'source', '-q:a', '0', '-map', 'a', 'sink.mp3')
        break
      case 'wav':
        type = 'audio/wav'
        await ffmpeg.run('-i', 'source', '-acodec', 'pcm_u8', '-ar', '22050', 'sink.wav')
        break
      case 'mp4':
        type = 'video/mp4'
        await ffmpeg.run('-i', 'source', '-codec', 'copy', 'sink.mp4')
        break
      case 'mov':
        type = 'video/quicktime'
        await ffmpeg.run('-i', 'source', '-f', 'mov', 'sink.mov')
        break
      case 'mkv':
        type = 'ideo/x-matroska'
        await ffmpeg.run('-i', 'source', '-codec', 'copy', 'sink.mkv')
        break
      case 'gif':
        type = 'image/gif'
        await ffmpeg.run('-i', 'source', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'sink.gif')
        break
      case 'webm':
        type = 'video/webm'
        await ffmpeg.run('-i', 'source', '-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0', '-b:a', '128k', '-c:a', 'libopus', 'sink.webm')
        break

      default:
        break
    }
  }
  // Read the result
  const data = ffmpeg.FS('readFile', `sink.${operation.value}`)

  // Create a URL and download
  const blob = new Blob([data.buffer], { type })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'result'
  link.click()
  URL.revokeObjectURL(link.href)
  NProgress.done()
  isProcessing.value = false
}

const operations = [
  { name: 'mp3', id: 'mp3' },
  { name: 'wav', id: 'wav' },
  { name: 'mp4', id: 'mp4' },
  { name: 'mov', id: 'mov' },
  { name: 'mkv', id: 'mkv' },
  { name: 'gif', id: 'gif' },
  { name: 'webm', id: 'webm' },

]

</script>

<template>
  <p class="text-4xl">
    <carbon-tools-alt class="inline-block" />
    {{ t('utils.description') }}
  </p>

  <div class="py-4" />

  <label class="px-4" for="file">{{ t('utils.upload') }}</label>
  <input type="file" name="file" required @change="onChangeFile">
  <div class="py-2" />
  <label class="px-4" for="operationSelect">{{ t('utils.convert') }}</label>
  <select class="form-control text-black" name="operationSelect" @change="onChangeOperation">
    <option v-for="op in operations" :key="op.id" :value="op.id">
      {{ op.name }}
    </option>
  </select>

  <div class="py-2" />
  <input
    id="input"
    v-model="customCommand"
    :placeholder="t('utils.custom-command')"
    :aria-label="t('utils.custom-command')"
    type="text"
    autocomplete="false"
    p="x-4 y-2"
    w="250px"
    text="center"
    bg="transparent"
    border="~ rounded gray-200 dark:gray-700"
    outline="none active:none"
    @keydown.enter="onClickExecute"
  >
  <label class="hidden" for="input">{{ t('utils.custom-command') }}</label>

  <div>
    <button
      class="m-3 text-sm btn"
      :disabled="!isExecutionAvailable"
      @click="onClickExecute"
    >
      {{ t('utils.execute') }}
    </button>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
