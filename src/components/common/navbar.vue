<script setup lang="ts">
import {afficherMenuResponsive, fermerMenuResponsive} from '@/assets/js/UI/navigation';
import {RouterLink} from "vue-router";
import LanguageSwitcher from './LanguageSwitcher.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <nav>
    <img class="banner bannerLarge" src="@/assets/img/cosmetics/banniere.png" alt="Bannière BRGM">
    <img class="banner bannerSmall" src="@/assets/img/cosmetics/banniereSmall.svg" alt="Bannière BRGM">

    <div class="redirections">
      <RouterLink to="/accueil" class="action" active-class="active-link">
        <img src="@/assets/img/icons/accueil.png" alt="">
        {{ t('nav.home') }}
        <span></span>
      </RouterLink>
      <RouterLink to="/documentation" class="action" active-class="active-link">
        <img src="@/assets/img/icons/aide.png" alt="">
        {{ t('nav.documentation') }}
        <span></span>
      </RouterLink>
      <RouterLink to="/telecharger" class="action" active-class="active-link">
        <img src="@/assets/img/icons/dl.png" alt="">
        {{ t('nav.download') }}
        <span></span>
      </RouterLink>
      <RouterLink to="/calibration" class="bouton boutonFonce" active-class="active-link">
        <img src="@/assets/img/icons/fiole.png" alt="">
        {{ t('nav.calibration') }}
        <span></span>
      </RouterLink>
      <RouterLink to="/visualisation" class="bouton boutonFonce" active-class="active-link">
        <img src="@/assets/img/icons/graphique.png" alt="">
        {{ t('nav.visualization') }}
        <span></span>
      </RouterLink>

      <LanguageSwitcher class="language-switcher-nav" />
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
        <LanguageSwitcher class="language-switcher-mobile" />
      </div>

      <RouterLink to="/accueil" class="action" active-class="active-link">
        <div>
          <h3>{{ t('nav.home') }}</h3>
        </div>
      </RouterLink>
      <RouterLink to="/documentation" class="action" active-class="active-link">
        <div>
          <h3>{{ t('nav.documentation') }}</h3>
        </div>
      </RouterLink>
      <RouterLink to="/telecharger" class="action" active-class="active-link">
        <div>
          <h3>{{ t('nav.download') }}</h3>
        </div>
      </RouterLink>
      <RouterLink to="/calibration" class="action" active-class="active-link">
        <div>
          <h3>{{ t('nav.calibration') }}</h3>
        </div>
      </RouterLink>
      <RouterLink to="/visualisation" class="action" active-class="active-link">
        <div>
          <h3>{{ t('nav.visualization') }}</h3>
        </div>
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.language-switcher-nav {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.language-switcher-mobile {
  margin-left: auto;
  margin-right: 1rem;
}

@media screen and (max-width: 768px) {
  .language-switcher-nav {
    display: none;
  }
}
</style>