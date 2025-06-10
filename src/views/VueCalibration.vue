<script setup lang="ts">
import ControlleurCalibration from '@/assets/js/Calibration/ControlleurCalibration';
import GestionnaireCourbesCalibration from '@/assets/js/Calibration/gestionCalculsCourbesCalibration';
import {AffichageCalibration} from '@/assets/js/Calibration/AffichageCalibration';
import Session from '@/assets/js/Session/Session';
import {onMounted, ref} from 'vue';
import {copierScreenElement, copierTexte} from '@/assets/js/Common/pressePapier';
import {afficherMessageFlash} from '@/assets/js/Common/utils';

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
    afficherMessageFlash('Erreur', 'Une erreur inattendue est survenue lors du traitement du fichier.', 'error');
  }

  afficherMessageFlash("Succès", "Fichier de calibration chargé avec succès.", "success");
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
          <h2>Partie <span class="orange">Calibration</span></h2>
          <span class="texte-gris-simple">Vérifiez vos données de calibration de vos appareils de mesure, et exportez-les au format CSV simplifié.</span>
        </div>

        <div class="info">
          <span><img src="@/assets/img/icons/info.png" alt=""> Types de fichiers pris en charge</span>
          <ul>
            <li>Fichiers .dat pour les appareils Albillia sàrl</li>
            <li>Fichiers CSV issus de FluoGraphiX. En savoir plus sur les <a href="">fichiers CSV de calibration</a> de
              FluoGraphiX
            </li>
          </ul>
        </div>

        <span class="bouton boutonFonce" @click="ouvrirChoisirFichierCalibration()">COMMENCER</span>
      </div>
    </div>
  </section>

  <section class="calibration" v-else>

    <div class="concentrations">

      <div class="wrapBandeauCalibration">
        <h2 class="orange">Données à afficher</h2>

        <div class="bandeauCalibration">
          <div class="wrapTraceursCalibration">
          </div>

          <span class="separatorCalibration"></span>

          <div class="wrapLampesCalibration">
          </div>

          <span class="separatorCalibration"></span>

          <div>
            <div v-tooltip.top="'Importer un autre fichier de calibration'" class="boutonOrange boutonFonce boutonBandeauCalibration" @click="ouvrirChoisirFichierCalibration()">
              IMPORTER FICHIER<img src="@/assets/img/icons/importer.png"
                                   alt="Importer">
            </div>
            <div v-tooltip.top="'Réinitialiser l\'affichage du graphique'" class="boutonOrange boutonFonce boutonBandeauCalibration"
                 @click="AffichageCalibration.reinitialiserZoomGraphique()">ZOOM<img
                src="@/assets/img/icons/circulaire.png"
                alt="Réinitialiser">
            </div>
            <div v-tooltip.top="'Exporter au format CSV'" class="boutonOrange boutonFonce boutonBandeauCalibration"
                 @click="controleurCalibration.telechargerDonneesCalibration()">EXPORTER<img
                src="@/assets/img/icons/dl.png"
                alt="Exporter">
            </div>
            <div v-tooltip.top="'Copier une capture d\'écran'" class="boutonOrange boutonFonce boutonBandeauCalibration" @click="copierScreenElement('.donnees')"><img
                src="@/assets/img/icons/copier.png" alt="Capture"></div>
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
              <span class="text">Utilitaire d'équations</span>
              <span>
                <span class="color"></span>
                <span class="color"></span>
                <span class="color"></span>
              </span>
            </div>

            <span class="copier" @click="copierTexte('.equation')">
              <span>Copier</span>
              <img src="@/assets/img/icons/copier.png" alt="">
            </span>

            <div class="equation">
              <span>Aucune équation à afficher pour l'instant.</span>
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

