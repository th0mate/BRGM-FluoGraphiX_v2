<script setup lang="ts">
import {copierScreenElement, copierTexte} from '@/assets/js/Common/pressePapier';
import Session from '@/assets/js/Session/Session';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  affichageVisualisation: any,
  controlleurVisualisation: any,
  choisirFichier: Function
}>();

</script>

<template>
  <div class="card anomalie" v-if="controlleurVisualisation.anomalieCalibration">
    <img src="@/assets/img/popup/warning.png" alt="" class="icone">
    <span id="anomaly">{{ t('carousel.commons.calibrationAnomalyDetected') }}</span>
  </div>
  <div class="card anomalie" v-else-if="Session.getInstance().contenuFichierCalibration !== ''">
    <img src="@/assets/img/popup/success.png" alt="" class="icone">
    <span>{{ t('carousel.commons.noCalibrationAnomaly') }}</span>
  </div>
  <div class="card anomalie" v-else>
    <img src="@/assets/img/popup/error.png" alt="" class="icone">
    <span>{{ t('carousel.commons.noCalibrationImported') }}</span>
  </div>
  <div class="actions card">
    <img v-tooltip.top="t('carousel.commons.tooltips.importMoreFiles')" class="action" src="@/assets/img/icons/importer.png"
         alt="Importer" @click="choisirFichier()">
    <img id="axeX" v-tooltip.top="t('carousel.commons.tooltips.lockUnlockXAxis')" class="action"
         src="@/assets/img/icons/x_axis.png" alt="Importer" @click="controlleurVisualisation.modifierAxesZoomDeplacement('x')">
    <img id="axeY" v-tooltip.top="t('carousel.commons.tooltips.lockUnlockYAxis')" class="action"
         src="@/assets/img/icons/y_axis.png" alt="Importer" @click="controlleurVisualisation.modifierAxesZoomDeplacement('y')">
    <img v-tooltip.top="t('carousel.commons.tooltips.resetChartDisplay')" class="action"
         src="@/assets/img/icons/circulaire.png" alt="Importer" @click="affichageVisualisation.reinitialiserZoomGraphique">
    <img v-tooltip.top="t('carousel.commons.tooltips.takeChartScreenshot')" class="action"
         src="@/assets/img/icons/copier.png" alt="Importer" @click="copierScreenElement('.graphique')">
  </div>
</template>

<style scoped>

</style>