<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <section class="glassmorphism">

    <div class="glasmorphism-wrap">
      <div class="left">
        <img src="@/assets/img/cosmetics/brgm.svg" class="logo" alt="">
        <img src="@/assets/img/illus/download.svg" alt="">
      </div>

      <div class="right">
        <div class="presentation">
          <h2>{{ t('download.title') }} <span class="orange">FluoGraphiX</span></h2>
          <span class="texte-gris-simple" v-html="t('download.subtitle')"></span>
        </div>

        <div class="possibility windows">
          <img src="@/assets/img/icons/windows.png" alt="Windows">
          <h4>{{ t('download.windows') }}</h4>
          <a href="#" class="bouton boutonFonce">{{ t('buttons.download') }}</a>
        </div>
        <div class="possibility mac">
          <img src="@/assets/img/icons/mac.png" alt="Mac">
          <h4>{{ t('download.mac') }}</h4>
          <a href="#" class="bouton boutonFonce">{{ t('buttons.download') }}</a>
        </div>
        <div class="possibility android">
          <img src="@/assets/img/icons/android.png" alt="Android">
          <h4>{{ t('download.linux') }}</h4>
          <a href="#" class="bouton boutonFonce">{{ t('buttons.download') }}</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import "@/assets/styles/glassmorphism.css";

.glassmorphism {
  background-image: url('@/assets/img/hydro_pictures/img10.jpg');
}

.right {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>