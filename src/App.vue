<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router';
import {onMounted, onUnmounted, ref} from 'vue';
import Navbar from './components/common/navbar.vue'
import Footer from './components/common/footer.vue'
import GlobalPopup from './components/common/GlobalPopup.vue';
import Session from '@/assets/js/Session/Session';
import { useToast } from 'primevue/usetoast';
import { setToastInstance } from '@/assets/js/Common/toastService';

const toast = useToast();
setToastInstance(toast);

const updateStatus = ref('');
const downloadProgress = ref(0);
const showUpdatePrompt = ref(false);
const appVersion = ref('');
const updateVersion = ref('');
const transferredMB = ref(0);
const totalMB = ref(0);

onMounted(async () => {
  try {
    appVersion.value = await window.electronAPI.getAppVersion();
    console.info(`Version de l'application : ${appVersion.value}`);


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
  } catch (error) {
    console.warn('Version hébergée ou hors-ligne détectée. Le processus de mise à jour a été ignoré.');
  }
});
</script>

<template>
  <Toast />
  <GlobalPopup />

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

<style>
body::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('@/assets/img/backgrounds/squares.jpg') repeat;
  background-size: 1000px 500px;
  opacity: 0.2;
  z-index: -1;
}

@font-face {
  font-family: 'gibson-heavy';
  src: url('@/assets/fonts/Gibson_Heavy.otf') format('opentype');
}

@font-face {
  font-family: 'gibson-bold';
  src: url('@/assets/fonts/Gibson_Bold.otf') format('opentype');
}

@font-face {
  font-family: 'gibson-semibold';
  src: url('@/assets/fonts/Gibson_SemiBold.otf') format('opentype');
}

@font-face {
  font-family: 'gibson-medium';
  src: url('@/assets/fonts/Gibson_Medium.otf') format('opentype');
}

@font-face {
  font-family: 'gibson-bold';
  src: url('@/assets/fonts/Gibson_Bold.otf') format('opentype');
}

@font-face {
  font-family: 'gibson-book';
  src: url('@/assets/fonts/Gibson_Book.otf') format('opentype');
}

@font-face {
  font-family: 'gibson-light';
  src: url('@/assets/fonts/Gibson_Light.otf') format('opentype');
}

</style>
