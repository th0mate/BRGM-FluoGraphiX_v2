<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router';
import { onMounted, onUnmounted, ref } from 'vue';

const updateStatus = ref('');
const downloadProgress = ref(0);
const showUpdatePrompt = ref(false);

onMounted(() => {
  window.electronAPI.onUpdateAvailable((event, info) => {
    updateStatus.value = `Nouvelle version ${info.version} disponible !`;
    showUpdatePrompt.value = true;
    console.log(updateStatus.value);
  });

  window.electronAPI.onDownloadProgress((event, progressObj) => {
    updateStatus.value = `Téléchargement en cours... ${Math.round(progressObj.percent)}%`;
    downloadProgress.value = progressObj.percent;
    console.log(updateStatus.value);
  });

  window.electronAPI.onUpdateDownloaded((event, info) => {
    updateStatus.value = `Mise à jour ${info.version} téléchargée. Redémarrez l'application pour appliquer.`;
    downloadProgress.value = 100;
    console.log(updateStatus.value);
  });

  window.electronAPI.onUpdateNotAvailable(() => {
    updateStatus.value = 'Votre application est à jour.';
    showUpdatePrompt.value = false;
    downloadProgress.value = 0;
    console.log(updateStatus.value);
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


  <RouterView id="contenu"/>

</template>

<style scoped>

</style>
