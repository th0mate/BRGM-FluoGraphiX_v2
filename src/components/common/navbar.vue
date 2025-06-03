<script setup lang="ts">
import {afficherMenuResponsive, fermerMenuResponsive} from '@/assets/js/UI/navigation';

import {RouterLink} from "vue-router";
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

    <div class="menuBurger" @click="afficherMenuResponsive">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <div class="menu">
      <img src="@/assets/img/hydro_pictures/img2.jpg" alt="background">

      <div class="entete">
        <img class="fermer" src="@/assets/img/icons/close.png" alt="fermer" @click="fermerMenuResponsive">
      </div>

      <RouterLink to="/accueil" class="action" active-class="active-link">
        <div>
          <h3>ACCUEIL</h3>
        </div>
      </RouterLink>
      <RouterLink to="/documentation" class="action" active-class="active-link">
        <div>
          <h3>DOCUMENTATION</h3>
        </div>
      </RouterLink>
      <RouterLink to="/telecharger" class="action" active-class="active-link">
        <div>
          <h3>TÉLÉCHARGER</h3>
        </div>
      </RouterLink>
      <RouterLink to="/calibration" class="action" active-class="active-link">
        <div>
          <h3>CALIBRATION</h3>
        </div>
      </RouterLink>
      <RouterLink to="/visualisation" class="action" active-class="active-link">
        <div>
          <h3>VISUALISATION</h3>
        </div>
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>

</style>