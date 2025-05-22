<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router';
import {onMounted, onUnmounted, ref} from 'vue';
import Navbar from './components/common/navbar.vue'
import Footer from './components/common/footer.vue'

const updateStatus = ref('');
const downloadProgress = ref(0);
const showUpdatePrompt = ref(false);
const appVersion = ref('');
const updateVersion = ref('');
const transferredMB = ref(0);
const totalMB = ref(0);

onMounted(async () => {
  appVersion.value = await window.electronAPI.getAppVersion();

  window.electronAPI.onUpdateAvailable((event, info) => {
    updateVersion.value = info.version || '';
    showUpdatePrompt.value = false;
    downloadProgress.value = 0;
    transferredMB.value = 0;
    totalMB.value = 0;
  });

  window.electronAPI.onDownloadProgress((event, progressObj) => {
    showUpdatePrompt.value = true;
    downloadProgress.value = progressObj.percent;
    updateVersion.value = progressObj.version || updateVersion.value;
    transferredMB.value = Number((progressObj.transferred / 1024 / 1024).toFixed(2));
    totalMB.value = Number((progressObj.total / 1024 / 1024).toFixed(2));
  });

  window.electronAPI.onUpdateDownloaded((event, info) => {
    showUpdatePrompt.value = false;
    downloadProgress.value = 100;
    transferredMB.value = totalMB.value;
  });

  window.electronAPI.onUpdateNotAvailable(() => {
    console.info('Votre version de FluoGraphiX est à jour.');
    showUpdatePrompt.value = false;
    downloadProgress.value = 0;
    transferredMB.value = 0;
    totalMB.value = 0;
  });
});

</script>

<template>

  <Navbar/>

  <div v-if="showUpdatePrompt && downloadProgress > 0 && downloadProgress < 100" class="update-notification">
    <div class="update-header">
      <span>Téléchargement de la mise à jour...</span>
    </div>
    <div class="update-content">
      <div class="update-wrap">
        <span>
          <img src="@/assets/img/icons/brgm.png" alt="">
          FluoGraphiX v{{ updateVersion }}
        </span>
        <span class="column">
          <span class="percentage">{{ Math.round(downloadProgress) }}% téléchargés</span>
          <span class="poids">{{ transferredMB }} MB / {{ totalMB }} MB</span>
        </span>
      </div>
      <div class="progress-bar">
        <div class="progress-bar-inner" :style="{ width: downloadProgress + '%' }"></div>
      </div>
    </div>
  </div>

  <div id="contenu">
  <RouterView/>
  </div>

  <Footer/>
</template>
