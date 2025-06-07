<script setup lang="ts">
import {ref} from "vue";
import {ControlleurVisualisation} from '@/assets/js/Visualisation/ControlleurVisualisation';
import Carousel from '@/components/Visualisation/Carousel.vue';
import {reactive} from "vue";
import { AffichageVisualisation } from "@/assets/js/Visualisation/AffichageVisualisation"

const affichageVisualisation = reactive(new AffichageVisualisation());
const controlleurVisualisation = reactive(new ControlleurVisualisation());


const donneesChargees = ref(false);
function traiterFichierFront(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    donneesChargees.value = true;
    controlleurVisualisation.traiterFichiers(input.files);
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
          <h2>Partie <span class="orange">Visualisation</span></h2>
          <span class="texte-gris-simple">Consultez vos données de mesure et effectuez des opération de correction et d'export</span>
        </div>

        <div class="info">
          <span><img src="@/assets/img/icons/info.png" alt=""> Types de fichiers pris en charge</span>
          <ul>
            <li>Fichiers .dat et <a href="">CSV issus de FluoGraphiX</a> pour les données de calibration</li>
            <li>Fichiers MV, CSV, XML et TXT pour les données de mesure</li>
          </ul>
        </div>

        <div class="wrap">
          <span class="texte-gris-simple">Format de date :</span>
          <select>
            <option selected>jj/mm/aaaa</option>
            <option>mm/jj/aaaa</option>
          </select>
        </div>

        <span class="bouton boutonFonce" @click="choisirFichier">COMMENCER</span>
      </div>
    </div>
  </section>

  <section class="visualisation" v-else>
    <div class="wrap-graphique">
    <canvas class="graphique" id="graphique"></canvas>
    </div>

    <Carousel :affichageVisualisation="affichageVisualisation"  :controlleurVisualisation="controlleurVisualisation"/>
  </section>

  <input style="display: none" type="file" id="fileInput" accept=".mv,.dat,.txt,.xml,.csv" multiple @change="traiterFichierFront">

</template>

<style>
@import "@/assets/styles/glassmorphism.css";
@import "@/assets/styles/visualisation.css";

.glassmorphism {
  background-image: url('@/assets/img/hydro_pictures/img14.jpg');
}
</style>