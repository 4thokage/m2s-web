<script setup lang="ts">

const video = 'https://www.youtube.com/watch?v=-OTc0Ki7Sv0'

</script>

<template>
  <video :src="video" controls />
  <br>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
