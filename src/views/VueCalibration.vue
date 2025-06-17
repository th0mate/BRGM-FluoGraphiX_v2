<script setup lang="ts">
import ControlleurCalibration from '@/assets/js/Calibration/ControlleurCalibration';
import GestionnaireCourbesCalibration from '@/assets/js/Calibration/gestionCalculsCourbesCalibration';
import {AffichageCalibration} from '@/assets/js/Calibration/AffichageCalibration';
import Session from '@/assets/js/Session/Session';
import {onMounted, ref} from 'vue';
import {copierScreenElement, copierTexte} from '@/assets/js/Common/pressePapier';
import {afficherMessageFlash} from '@/assets/js/Common/utils';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const fichierCharge = ref(false);
const controleurCalibration = new ControlleurCalibration();
const gestionnaireCalibration = new GestionnaireCourbesCalibration();

function ouvrirChoisirFichierCalibration() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.dat,.csv';
  input.addEventListener('change', traitementFichierCalibration);
  input.click();
}

function traitementFichierCalibration(event: Event) {
  try {
    const input = event.target as HTMLInputElement;
    const fichier = input.files?.[0];
    if (!fichier) return;
    const lecteur = new FileReader();

    lecteur.onload = function (e: ProgressEvent<FileReader>) {
      if (e.target?.result) {
        fichierCharge.value = true;
        Session.getInstance().contenuFichierCalibration = e.target.result as string;
        const estFichierDat = fichier.name.toLowerCase().endsWith('.dat');

        setTimeout(() => {
          controleurCalibration.initialiser(Session.getInstance().contenuFichierCalibration, estFichierDat);
        }, 0);
      }
    };

    lecteur.readAsText(fichier);
  } catch (error) {
    afficherMessageFlash('notifications.error.title', 'notifications.error.undefinedError', 'error');
  }

  afficherMessageFlash("notifications.success.title", "notifications.success.calibrationLoaded", "success");
}
</script>

<template>
  <section class="glassmorphism" v-if="!fichierCharge">

    <div class="glasmorphism-wrap">
      <div class="left">
        <img src="@/assets/img/cosmetics/brgm.svg" class="logo" alt="">
        <img src="@/assets/img/illus/screen1.png" alt="">
      </div>


      <div class="right">
        <div class="presentation">
          <h2>{{ t('calibration.title') }} <span class="orange">{{ t('calibration.titleHighlight') }}</span></h2>
          <span class="texte-gris-simple">{{ t('calibration.description') }}</span>
        </div>

        <div class="info">
          <span><img src="@/assets/img/icons/info.png" alt=""> {{ t('calibration.supportedFiles') }}</span>
          <ul>
            <li>{{ t('calibration.supportedFilesList.dat') }}</li>
            <li>{{ t('calibration.supportedFilesList.csv') }} <a href="">{{ t('calibration.supportedFilesList.csvLink') }}</a> {{ t('calibration.supportedFilesList.csvLinkEnd') }}
            </li>
          </ul>
        </div>

        <span class="bouton boutonFonce" @click="ouvrirChoisirFichierCalibration()">{{ t('buttons.start') }}</span>
      </div>
    </div>
  </section>

  <section class="calibration" v-else>

    <div class="concentrations">

      <div class="wrapBandeauCalibration">
        <h2 class="orange">{{ t('calibration.dataToDisplay') }}</h2>

        <div class="bandeauCalibration">
          <div class="wrapTraceursCalibration">
          </div>

          <span class="separatorCalibration"></span>

          <div class="wrapLampesCalibration">
          </div>

          <span class="separatorCalibration"></span>

          <div>
            <div v-tooltip.top="t('calibration.buttons.importTooltip')" class="boutonOrange boutonFonce boutonBandeauCalibration" @click="ouvrirChoisirFichierCalibration()">
              {{ t('calibration.buttons.import') }}<img src="@/assets/img/icons/importer.png"
                                   alt="Importer">
            </div>
            <div v-tooltip.top="t('calibration.buttons.zoomTooltip')" class="boutonOrange boutonFonce boutonBandeauCalibration"
                 @click="AffichageCalibration.reinitialiserZoomGraphique()">{{ t('calibration.buttons.zoom') }}<img
                src="@/assets/img/icons/circulaire.png"
                alt="Réinitialiser">
            </div>
            <div v-tooltip.top="t('calibration.buttons.exportTooltip')" class="boutonOrange boutonFonce boutonBandeauCalibration"
                 @click="controleurCalibration.exporterDonneesCSV()">{{ t('calibration.buttons.export') }}<img
                src="@/assets/img/icons/dl.png"
                alt="Exporter">
            </div>
            <div v-tooltip.top="t('calibration.buttons.screenshotTooltip')" class="boutonOrange boutonFonce boutonBandeauCalibration" @click="copierScreenElement('.donnees')"><img
                src="@/assets/img/icons/copier.png" alt="{{ t('calibration.buttons.screenshot') }}"></div>
          </div>
        </div>
      </div>

      <div class="bandeau">
        <input type="file" accept=".dat, .csv" id="calibratInput" @change="traitementFichierCalibration">
      </div>

      <div class="descriptionConcentration"></div>

      <div class="donnees">
        <div class="wrap-tableau">
          <div class="utilitaire">
            <div class="header">
              <span class="text">{{ t('calibration.equationUtility.title') }}</span>
              <span>
                <span class="color"></span>
                <span class="color"></span>
                <span class="color"></span>
              </span>
            </div>

            <span class="copier" @click="copierTexte('.equation')">
              <span>{{ t('calibration.equationUtility.copy') }}</span>
              <img src="@/assets/img/icons/copier.png" alt="">
            </span>

            <div class="equation">
              <span>{{ t('calibration.equationUtility.noEquation') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
@import "@/assets/styles/glassmorphism.css";
@import "@/assets/styles/calibration.css";

.glassmorphism {
  background-image: url('@/assets/img/hydro_pictures/img13.jpg');
}
</style>
