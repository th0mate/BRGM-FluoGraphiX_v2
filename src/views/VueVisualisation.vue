<script setup lang="ts">
import {ref} from "vue";
import {ControlleurVisualisation} from '@/assets/js/Visualisation/ControlleurVisualisation';
import Carousel from '@/components/Visualisation/Carousel.vue';
import {reactive, onMounted} from "vue";
import {AffichageVisualisation} from "@/assets/js/Visualisation/AffichageVisualisation";
import {useI18n} from 'vue-i18n';
import Session from '@/assets/js/Session/Session';
import {afficherPopup} from "@/assets/js/UI/popupService.ts";
import errorImage from "@/assets/img/popup/error.png";


const {t} = useI18n();
const affichageVisualisation = reactive(new AffichageVisualisation());
const controlleurVisualisation = reactive(new ControlleurVisualisation());

onMounted(() => {
  affichageVisualisation.setControlleurVisualisation(controlleurVisualisation);
  controlleurVisualisation.setAffichageVisualisation(affichageVisualisation);
});


const donneesChargees = ref(false);

function traiterFichierFront(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    donneesChargees.value = true;
    controlleurVisualisation.traiterFichiers(input.files).then(() => {
    }).catch(() => {
      Session.getInstance().reset();
      Session.getInstance().formatDates = 1;
      donneesChargees.value = false;
      afficherPopup(
          `<img src="${errorImage}" alt="Avertissement" style="width: 120px;">`,
          t('popups.error.title'),
          t('popups.error.generalVisualisation'),
          t('popups.error.generalVisualisationDescription'),
          t('buttons.close')
      );
    });
  } else {
    console.error("Aucun fichier sélectionné.");
  }
}

function choisirFichier() {
  const input = document.getElementById('fileInput') as HTMLInputElement;
  if (input) {
    input.click();
  }
}

function changerFormatDates(key: string) {
  Session.getInstance().formatDates = parseInt(key);
}
</script>

<template>
  <section class="glassmorphism" v-if="!donneesChargees">

    <div class="glasmorphism-wrap">
      <div class="left">
        <img src="@/assets/img/cosmetics/brgm.svg" class="logo" alt="">
        <img src="@/assets/img/illus/screen2.png" alt="">
      </div>


      <div class="right">
        <div class="presentation">
          <h2>{{ t('visualization.title') }} <span class="orange">{{ t('visualization.titleHighlight') }}</span></h2>
          <span class="texte-gris-simple">{{ t('visualization.description') }}</span>
        </div>

        <div class="info">
          <span><img src="@/assets/img/icons/info.png" alt=""> {{ t('visualization.supportedFiles') }}</span>
          <ul>
            <li>{{ t('visualization.supportedFilesList.calibration') }} <a
                href="">{{ t('visualization.supportedFilesList.calibrationLink') }}</a>
              {{ t('visualization.supportedFilesList.calibrationLinkEnd') }}
            </li>
            <li>{{ t('visualization.supportedFilesList.measurements') }}</li>
          </ul>
        </div>

        <div class="wrap">
          <span class="texte-gris-simple">{{ t('visualization.dateFormat') }}</span>
          <select @change="changerFormatDates(($event.target as HTMLSelectElement)?.value)"
                  class="select">
            <option selected value="1">{{ t('visualization.dateFormats.ddmmyyyy') }}</option>
            <option value="2">{{ t('visualization.dateFormats.mmddyyyy') }}</option>
          </select>
        </div>

        <span class="bouton boutonFonce" @click="choisirFichier">{{ t('buttons.start') }}</span>
      </div>
    </div>
  </section>

  <section class="visualisation" v-else>
    <div class="wrap-graphique">
      <span class="titre">{{ t('visualization.dataFromFile') }} <span class="orange nomFichier"></span> :</span>
      <div class="padding-graphique">
        <canvas class="graphique" id="graphique"></canvas>
      </div>
      <img v-tooltip.bottom="'Calcul en cours...'" src="@/assets/img/popup/loading.gif" class="chargement-calculs"
           :style="{ display: controlleurVisualisation.chargementCalculs ? 'block' : 'none' }" alt="">
    </div>

    <Carousel :affichageVisualisation="affichageVisualisation" :controlleurVisualisation="controlleurVisualisation"
              :choisirFichier="choisirFichier" v-model:donneesChargees="donneesChargees"/>
  </section>

  <input style="display: none" type="file" id="fileInput" accept=".mv,.dat,.txt,.xml,.csv" multiple
         @change="traiterFichierFront">

</template>

<style>
@import "@/assets/styles/glassmorphism.css";
@import "@/assets/styles/visualisation.css";

.glassmorphism {
  background-image: url('@/assets/img/hydro_pictures/img14.jpg');
}
</style>