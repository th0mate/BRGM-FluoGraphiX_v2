<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router';
import {onMounted, onUnmounted, ref} from 'vue';

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
    showUpdatePrompt.value = false;
    downloadProgress.value = 0;
    transferredMB.value = 0;
    totalMB.value = 0;
  });
});

</script>

<template>
  <nav>
    <img class="banner bannerLarge" src="@/assets/img/cosmetics/banniere.png" alt="Bannière BRGM">
    <img class="banner bannerSmall" src="@/assets/img/cosmetics/banniereSmall.svg" alt="Bannière BRGM">

    <div class="redirections">
      <RouterLink to="/accueil" class="action" active-class="active-link">
        <img src="@/assets/img/icons/accueil.png" alt="">
        ACCUEIL
        <span></span>
      </RouterLink>
      <RouterLink to="/documentation" class="action" active-class="active-link">
        <img src="@/assets/img/icons/aide.png" alt="">
        DOCUMENTATION
        <span></span>
      </RouterLink>
      <RouterLink to="/telecharger" class="action" active-class="active-link">
        <img src="@/assets/img/icons/dl.png" alt="">
        TÉLÉCHARGER
        <span></span>
      </RouterLink>
      <RouterLink to="/calibration" class="bouton boutonFonce" active-class="active-link">
        <img src="@/assets/img/icons/fiole.png" alt="">
        CALIBRATION
        <span></span>
      </RouterLink>
      <RouterLink to="/visualisation" class="bouton boutonFonce" active-class="active-link">
        <img src="@/assets/img/icons/graphique.png" alt="">
        VISUALISATION
        <span></span>
      </RouterLink>
    </div>

    <div class="menuBurger" onclick="">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <div class="menu">
      <img src="@/assets/img/hydro_pictures/img2.jpg" alt="background">

      <div class="entete">
        <img src="@/assets/img/icons/close.png" alt="fermer" onclick="">
      </div>

      <RouterLink to="/accueil" class="action" active-class="active-link">
        <div>
          <img src="@/assets/img/icons/accueil.png" alt="">
          <h3>ACCUEIL</h3>
        </div>
        <img src="@/assets/img/icons/droite.png" alt="flèche">
      </RouterLink>
      <RouterLink to="/documentation" class="action" active-class="active-link">
        <div>
          <img src="@/assets/img/icons/aide.png" alt="">
          <h3>DOCUMENTATION</h3>
        </div>
        <img src="@/assets/img/icons/droite.png" alt="flèche">
      </RouterLink>
      <RouterLink to="/telechargement" class="action" active-class="active-link">
        <div>
          <img src="@/assets/img/icons/dl.png" alt="">
          <h3>TÉLÉCHARGER</h3>
        </div>
        <img src="@/assets/img/icons/droite.png" alt="flèche">
      </RouterLink>
      <RouterLink to="/calibration" class="action" active-class="active-link">
        <div>
          <img src="@/assets/img/icons/calculatrice.png" alt="">
          <h3>CALIBRATION</h3>
        </div>
        <img src="@/assets/img/icons/droite.png" alt="flèche">
      </RouterLink>
      <RouterLink to="/visualisation" class="action" active-class="active-link">
        <div>
          <img src="@/assets/img/icons/graphique.png" alt="">
          <h3>VISUALISATION</h3>
        </div>
        <img src="@/assets/img/icons/droite.png" alt="flèche">
      </RouterLink>
    </div>
  </nav>

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
  <RouterView id="contenu"/>
</template>
