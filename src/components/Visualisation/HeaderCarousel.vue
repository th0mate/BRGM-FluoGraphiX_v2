<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <div class="header">
    <span class="text">{{ t('carousel.header.title') }}</span>
    <span>
        <span class="color"></span>
        <span class="color"></span>
        <span class="color"></span>
      </span>
  </div>
</template>

<style scoped>

</style>