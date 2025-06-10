<script setup lang="ts">
import {copierScreenElement, copierTexte} from '@/assets/js/Common/pressePapier';

const props = defineProps<{
  affichageVisualisation: any,
  controlleurVisualisation: any,
  choisirFichier: Function
}>();

</script>

<template>
  <div class="card anomalie" v-if="controlleurVisualisation.anomalieCalibration">
    <img src="@/assets/img/popup/warning.png" alt="" class="icone">
    <span>Certaines de vos données de calibration sont susceptibles d'être incorrectes, veuillez les vérifier.</span>
  </div>
  <div class="card anomalie" v-else>
    <img src="@/assets/img/popup/success.png" alt="" class="icone">
    <span>Aucune anomalie n'a été détectée dans vos données de calibration.</span>
  </div>
  <div class="actions card">
    <img v-tooltip.top="'Importer d\'autres fichiers'" class="action" src="@/assets/img/icons/importer.png"
         alt="Importer" @click="choisirFichier()">
    <img id="axeX" v-tooltip.top="'Bloquer/libérer les interactions sur l\'axe x'" class="action"
         src="@/assets/img/icons/x_axis.png" alt="Importer" @click="controlleurVisualisation.modifierAxesZoomDeplacement('x')">
    <img id="axeY" v-tooltip.top="'Bloquer/libérer les interactions sur l\'axe y'" class="action"
         src="@/assets/img/icons/y_axis.png" alt="Importer" @click="controlleurVisualisation.modifierAxesZoomDeplacement('y')">
    <img v-tooltip.top="'Réinitialiser l\'affichage du graphique'" class="action"
         src="@/assets/img/icons/circulaire.png" alt="Importer" @click="affichageVisualisation.reinitialiserZoomGraphique">
    <img v-tooltip.top="'Prendre une capture d\'écran du graphique'" class="action"
         src="@/assets/img/icons/copier.png" alt="Importer" @click="copierScreenElement('.graphique')">
  </div>
</template>

<style scoped>

</style>