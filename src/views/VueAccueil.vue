<script setup lang="ts">
import {RouterLink} from "vue-router";
import Router from "@/router";
import {onMounted, ref} from "vue";
import {scrollToElement} from '@/assets/js/UI/navigation';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const appVersion = ref('');

onMounted(async () => {
  try {
    appVersion.value = await window.electronAPI.getAppVersion();
  } catch (error) {
  }
});

</script>

<template>
  <section class="main-pres">
    <h1>{{ t('home.heroTitle') }}</h1>
    <span class="bouton-main" @click="scrollToElement('#presentation')">{{ t('buttons.discover') }}</span>
    <span v-if="appVersion !== ''" class="version">v{{ appVersion }}</span>

    <div class="wrap-cards">
      <div class="card">
        <span class="color"></span>
        <span>{{ t('home.cards.visualize') }}</span>
        <RouterLink to="/visualisation" class="animated-link">{{ t('home.cards.seeMore') }} <img src="@/assets/img/icons/fleche-droite.png" alt=""></RouterLink>
      </div>

      <div class="card">
        <span class="color"></span>
        <span>{{ t('home.cards.calibration') }}</span>
        <RouterLink to="/calibration" class="animated-link">{{ t('home.cards.seeMore') }} <img src="@/assets/img/icons/fleche-droite.png" alt=""></RouterLink>
      </div>

      <div class="card">
        <span class="color"></span>
        <span>{{ t('home.cards.documentation') }}</span>
        <RouterLink to="/documentation" class="animated-link">{{ t('home.cards.seeMore') }} <img src="@/assets/img/icons/fleche-droite.png" alt=""></RouterLink>
      </div>
    </div>
  </section>

  <section id="presentation" class="section-accueil">
    <img src="@/assets/img/illus/mockup1.png" alt="">
    <div>
      <h1>{{ t('home.welcome.title') }}<br> <span class="orange">FluoGraphiX</span> !</h1>
      <span class="texte-gris-simple">{{ t('home.welcome.subtitle') }}</span>
      <div class="wrap-boutons">
        <span class="bouton boutonFonce" @click="Router.push('/telecharger')">{{ t('buttons.download') }}</span>
        <span class="bouton boutonClair" @click="scrollToElement('.highlights')">{{ t('buttons.seeMore') }}</span>
      </div>
    </div>
  </section>

  <section class="highlights">
    <h2 class="grand-titre">{{ t('home.features.title') }}<br> <span class="orange">{{ t('home.features.titleHighlight') }}</span></h2>

    <div class="grid-highlights">

      <div class="hightlight">
        <img src="@/assets/img/higtlights/mobile.png" alt=""/>
        <h4>{{ t('home.features.mobile.title') }}</h4>
        <span class="texte-gris-simple">{{ t('home.features.mobile.description') }}</span>
      </div>
      <div class="hightlight">
        <img src="@/assets/img/higtlights/flexible.png" alt=""/>
        <h4>{{ t('home.features.versatile.title') }}</h4>
        <span class="texte-gris-simple">{{ t('home.features.versatile.description') }}</span>
      </div>
      <div class="hightlight">
        <img src="@/assets/img/higtlights/puzzle.png" alt=""/>
        <h4>{{ t('home.features.compatible.title') }}</h4>
        <span class="texte-gris-simple">{{ t('home.features.compatible.description') }}</span>
      </div>
      <div class="hightlight">
        <img src="@/assets/img/higtlights/compteur.png" alt=""/>
        <h4>{{ t('home.features.performance.title') }}</h4>
        <span class="texte-gris-simple">{{ t('home.features.performance.description') }}</span>
      </div>
      <div class="hightlight">
        <img src="@/assets/img/higtlights/csv.png" alt=""/>
        <h4>{{ t('home.features.calibration.title') }}</h4>
        <span class="texte-gris-simple">{{ t('home.features.calibration.description') }}</span>
      </div>
      <div class="hightlight">
        <img src="@/assets/img/higtlights/hausse.png" alt=""/>
        <h4>{{ t('home.features.interactive.title') }}</h4>
        <span class="texte-gris-simple">{{ t('home.features.interactive.description') }}</span>
      </div>
    </div>
  </section>

  <section class="section-accueil reverse orange">
    <img src="@/assets/img/illus/screen1.png" alt="">
    <div>
      <h2>{{ t('home.install.title') }} <span class="orange">FluoGraphiX</span><br> {{ t('home.install.titleEnd') }}</h2>
      <span class="texte-gris-simple">{{ t('home.install.subtitle') }}</span>
      <div class="wrap-boutons">
        <span class="bouton boutonFonce" @click="Router.push('/telecharger')">{{ t('buttons.download') }}</span>
        <span class="bouton boutonClair" @click="scrollToElement('#continue')">{{ t('buttons.seeMore') }}</span>
      </div>
    </div>
  </section>

  <section id="continue" class="section-accueil reverse white designed">
    <img src="@/assets/img/illus/design1.png" alt="">
    <div>
      <h2><span class="orange">{{ t('home.visualization.title') }}</span> {{ t('home.visualization.titleEnd') }}</h2>
      <span class="texte-gris-simple">{{ t('home.visualization.description1') }}</span>
      <span class="texte-gris-simple">{{ t('home.visualization.description2') }}</span>
      <span class="texte-gris-simple">{{ t('home.visualization.description3') }}</span>
      <div class="wrap-boutons" @click="Router.push('/visualisation')">
        <span class="bouton boutonFonce">{{ t('buttons.try') }}</span>
      </div>
    </div>
  </section>

  <section class="section-accueil designed">
    <img src="@/assets/img/illus/design2.png" alt="">
    <div>
      <h2>{{ t('home.calibrationSection.title') }}<br><span class="orange">{{ t('home.calibrationSection.titleEnd') }}</span></h2>
      <span class="texte-gris-simple">{{ t('home.calibrationSection.description1') }}</span>
      <span class="texte-gris-simple">{{ t('home.calibrationSection.description2') }}</span>
      <div class="wrap-boutons" @click="Router.push('/calibration')">
        <span class="bouton boutonFonce">{{ t('buttons.try') }}</span>
      </div>
    </div>
  </section>

  <section class="section-accueil designed gris">
    <img src="@/assets/img/illus/design3.png" alt="">
    <div>
      <h2>{{ t('home.contribute.title') }}<br><span class="orange">{{ t('home.contribute.titleEnd') }}</span></h2>
      <span class="texte-gris-simple">{{ t('home.contribute.description') }}</span>
      <div class="wrap-boutons">
        <a href="https://github.com/th0mate/BRGM-FluoGraphiX_v2" target="_blank" class="bouton boutonFonce">{{ t('buttons.seeMore') }}</a>
      </div>
    </div>
  </section>

</template>

<style scoped>
@import "@/assets/styles/styleAccueil.css";

.main-pres {
  background-image: url('@/assets/img/hydro_pictures/img6.jpg');
}
</style>