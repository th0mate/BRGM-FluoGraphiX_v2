<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router';
import {onMounted, onUnmounted, ref} from 'vue';

const updateStatus = ref('');
const downloadProgress = ref(0);
const showUpdatePrompt = ref(false);
const appVersion = ref('');

onMounted(async () => {
  appVersion.value = await window.electronAPI.getAppVersion();

  window.electronAPI.onUpdateAvailable((event, info) => {
    updateStatus.value = `Nouvelle version ${info.version} disponible !`;
    showUpdatePrompt.value = true;
    downloadProgress.value = 0;
  });

  window.electronAPI.onDownloadProgress((event, progressObj) => {
    updateStatus.value = `Téléchargement en cours... ${Math.round(progressObj.percent)}%`;
    downloadProgress.value = progressObj.percent;
    showUpdatePrompt.value = true;
  });

  window.electronAPI.onUpdateDownloaded((event, info) => {
    updateStatus.value = `Mise à jour ${info.version} téléchargée. Redémarrez l'application pour appliquer.`;
    downloadProgress.value = 100;
    showUpdatePrompt.value = true;
  });

  window.electronAPI.onUpdateNotAvailable(() => {
    updateStatus.value = '';
    showUpdatePrompt.value = false;
    downloadProgress.value = 0;
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
    <div class="update-content">
      <span>{{ updateStatus }}</span>
      <div class="progress-bar">
        <div class="progress-bar-inner" :style="{ width: downloadProgress + '%' }"></div>
        <span>{{ Math.round(downloadProgress) }}%</span>
      </div>
    </div>
  </div>

  <RouterView id="contenu"/>

</template>

<style scoped>
.update-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  padding: 16px 24px;
  z-index: 1000;
  min-width: 300px;
}
.update-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.progress-bar {
  width: 100%;
  background: #f5f5f5;
  border-radius: 4px;
  margin: 8px 0;
  height: 18px;
  position: relative;
}
.progress-bar-inner {
  height: 100%;
  background: #1890ff;
  border-radius: 4px;
  transition: width 0.3s;
}
</style>

