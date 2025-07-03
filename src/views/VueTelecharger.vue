<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { onMounted, ref } from 'vue';

const { t } = useI18n();

const downloadUrls = ref({
  windows: '#',
  mac: '#',
  linux: '#'
});

onMounted(async () => {
  try {
    const response = await fetch('https://api.github.com/repos/th0mate/BRGM-FluoGraphiX_v2/releases/latest');
    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    data.assets.forEach(asset => {
      if (asset.name.endsWith('.exe')) {
        downloadUrls.value.windows = asset.browser_download_url;
      } else if (asset.name.endsWith('.dmg')) {
        downloadUrls.value.mac = asset.browser_download_url;
      } else if (asset.name.endsWith('.AppImage')) {
        downloadUrls.value.linux = asset.browser_download_url;
      }
    });
  } catch (error) {
    console.error('Failed to fetch latest release assets:', error);
  }
});
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
          <a :href="downloadUrls.windows" class="bouton boutonFonce">{{ t('buttons.download') }}</a>
        </div>
        <div class="possibility mac">
          <img src="@/assets/img/icons/mac.png" alt="Mac">
          <h4>{{ t('download.mac') }}</h4>
          <a :href="downloadUrls.mac" class="bouton boutonFonce">{{ t('buttons.download') }}</a>
        </div>
        <div class="possibility android">
          <img src="@/assets/img/icons/linux.png" alt="Android">
          <h4>{{ t('download.linux') }}</h4>
          <a :href="downloadUrls.linux" class="bouton boutonFonce">{{ t('buttons.download') }}</a>
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