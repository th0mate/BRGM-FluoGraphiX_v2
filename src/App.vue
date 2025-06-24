<script setup lang="ts">
import {RouterView} from 'vue-router';
import {onMounted, ref, computed} from 'vue';
import Navbar from './components/common/navbar.vue'
import Footer from './components/common/footer.vue'
import { useToast } from 'primevue/usetoast';
import { setToastInstance } from '@/assets/js/Common/toastService';
import CustomPopup from '@/components/common/CustomPopup.vue';
import popupService from '@/assets/js/UI/popupService';

const popupVisible = computed({
  get: () => popupService.state.visible,
  set: (value) => {
    if (!value) {
      popupService.closePopup();
    }
  }
});

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

  <Navbar/>

  <CustomPopup
    v-model="popupVisible"
    :headerTitle="popupService.state.headerTitle"
    :title="popupService.state.title"
    :content="popupService.state.content"
    :buttonText="popupService.state.buttonText"
    :imageUrl="popupService.state.imageUrl"
    :imageHtml="popupService.state.imageHtml"
  />

  <div v-if="showUpdatePrompt && downloadProgress > 0 && downloadProgress < 100" class="update-notification">
    <div class="update-header">
      <span>{{ $t('updates.downloading') }}</span>
    </div>
    <div class="update-content">
      <div class="update-wrap">
        <span>
          <img src="@/assets/img/icons/brgm.png" alt="">
          {{ $t('updates.version', { version: updateVersion }) }}
        </span>
        <span class="column">
          <span class="percentage">{{ $t('updates.downloaded', { percentage: Math.round(downloadProgress) }) }}</span>
          <span class="poids">{{ $t('updates.size', { transferred: transferredMB, total: totalMB }) }}</span>
        </span>
      </div>
      <div class="progress-bar">
        <div class="progress-bar-inner" :style="{ width: downloadProgress + '%' }"></div>
      </div>
    </div>
  </div>


<!--  <div class="update-notification">-->
<!--    <div class="update-header">-->
<!--      <span>Téléchargement de la mise à jour...</span>-->
<!--    </div>-->
<!--    <div class="update-content">-->
<!--      <div class="update-wrap">-->
<!--        <span>-->
<!--          <img src="@/assets/img/icons/brgm.png" alt="">-->
<!--          FluoGraphiX v2.0.1-->
<!--        </span>-->
<!--        <span class="column">-->
<!--          <span class="percentage">75% téléchargés</span>-->
<!--          <span class="poids">76MB / 154MB</span>-->
<!--        </span>-->
<!--      </div>-->
<!--      <div class="progress-bar">-->
<!--        <div class="progress-bar-inner" :style="{ width: '75' + '%' }"></div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->

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
