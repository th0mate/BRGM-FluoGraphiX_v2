<script setup lang="ts">
import {Splide, SplideSlide} from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';
import HeaderCarousel from "@/components/Visualisation/HeaderCarousel.vue"
import CommunCarousel from "@/components/Visualisation/CommunCarousel.vue"
import {onMounted, ref, computed, watch} from "vue";
import ToggleSwitch from 'primevue/toggleswitch';
import Session from '@/assets/js/Session/Session';

const props = defineProps<{ affichageVisualisation: any, controlleurVisualisation : any, choisirFichier: Function }>();

const splideRef = ref();
const isCalibrationLinked = ref(props.controlleurVisualisation.calibrationEstLieeGraphique);
const hasCalibrationFile = ref(Session.getInstance().contenuFichierCalibration !== '');

watch(() => props.controlleurVisualisation.calibrationEstLieeGraphique, (newValue) => {
  isCalibrationLinked.value = newValue;
});

onMounted(() => {
  props.affichageVisualisation.preparerInputRange();

  const interval = setInterval(() => {
    isCalibrationLinked.value = props.controlleurVisualisation.calibrationEstLieeGraphique;
    hasCalibrationFile.value = Session.getInstance().contenuFichierCalibration !== '';
  }, 500);

  return () => clearInterval(interval);
});

function handleFileSelection(event: Event) {
  Session.getInstance().calculs = [];
  const input = event.target as HTMLInputElement;

  if (input && input.files && input.files.length > 0) {
    const reader = new FileReader();
    const file = input.files[0];
    let type = file.name.toLowerCase().endsWith('.dat') ? 'dat' : 'csv';

    reader.onload = () => {
      if (reader.result) {
        props.controlleurVisualisation.importerCalibration(file, type, true);
      }
    };

    reader.readAsText(file);
  } else {
    console.error("Aucun fichier sélectionné");
  }
}

const splideOptions = computed(() => {
  const shouldEnableSwipe = isCalibrationLinked.value && hasCalibrationFile.value;

  return {
    rewind: true,
    drag: shouldEnableSwipe,
    pagination: shouldEnableSwipe,
    arrows: shouldEnableSwipe,
  }
});

function initCalibrationDepuisVisualisation() {
  const input = document.getElementById('inputCalibration') as HTMLInputElement;
  if (input) {
    input.click();
    return;
  }
  console.error("L'élément inputCalibration n'a pas été trouvé");
}
</script>

<template>
  <Splide :options="splideOptions" class="carousel" ref="splideRef">

    <!-- Slide d'accueil : reset graphique et renommage des courbes -->
    <SplideSlide class="page">
      <HeaderCarousel/>
      <div class="cards">
        <div class="card">
          <b>Bienvenue dans l'utilitaire de calculs et d'export de FluoGraphiX</b>
          <span>Réalisez ici les différentes opérations de correction et d'export de vos courbes</span>
          <div class="bouton" @click="controlleurVisualisation.reinitialiserGraphique">Réinitialiser le graphique</div>
        </div>
        <div class="card" v-if="!isCalibrationLinked && hasCalibrationFile">
          <b>Vous devez renommer vos courbes en fonction de vos données de calibration :</b>
          <table>
            <thead>
            <tr>
              <th>Label</th>
              <th>Courbe</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>L1</td>
              <td><select>
                <option value="" disabled selected>Sélectionner...</option>
              </select></td>
            </tr>
            <tr>
              <td>L2</td>
              <td><select>
                <option value="" disabled selected>Sélectionner...</option>
              </select></td>
            </tr>
            <tr>
              <td>L3</td>
              <td><select>
                <option value="" disabled selected>Sélectionner...</option>
              </select></td>
            </tr>
            <tr>
              <td>L4</td>
              <td><select>
                <option value="" disabled selected>Sélectionner...</option>
              </select></td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="card" v-else-if="isCalibrationLinked && hasCalibrationFile">
          <div class="wrap-status">
            <img src="@/assets/img/popup/success.png" alt="">
            <div class="spacer"></div>
            <b>Vos traceurs ont été liés à vos données avec succès. Aucun action requise de votre part</b>
          </div>
        </div>

        <div class="card" v-else>
          <div class="wrap-status">
            <img src="@/assets/img/popup/error.png" alt="">
            <div class="spacer"></div>
            <b>Vous devez importer un fichier de calibration pour effectuer des corrections</b>
            <div class="spacer"></div>
            <div class="bouton" @click="initCalibrationDepuisVisualisation">Importer un fichier de calibration</div>
          </div>
        </div>
        <CommunCarousel :affichageVisualisation="affichageVisualisation"  :controlleurVisualisation="controlleurVisualisation" :choisirFichier="choisirFichier"/>
      </div>
    </SplideSlide>

    <!-- Correction de la turbidité -->
    <SplideSlide class="page">
      <HeaderCarousel/>
      <div class="cards">
        <div class="card main">
          <b>Correction de la turbidité</b>
          <span>Corrigez l'influence de la turbidité sur vos courbes</span>
          <div class="spacer"></div>
          <span>Sélectionnez le niveau de correction à appliquer :</span>
          <div class='range'>
            <input id="inputRange" type="range" min='0' max='2' step='0.1' value="1"
                   @mousedown.stop="props.affichageVisualisation.disableCarouselDrag(splideRef)"
                   @touchstart.stop="props.affichageVisualisation.disableCarouselDrag(splideRef)"
                   @pointerdown.stop="props.affichageVisualisation.disableCarouselDrag(splideRef)"
                   @mouseup.stop="props.affichageVisualisation.enableCarouselDrag(splideRef)"
                   @touchend.stop="props.affichageVisualisation.enableCarouselDrag(splideRef)"
                   @pointerup.stop="props.affichageVisualisation.enableCarouselDrag(splideRef)"
            />
            <span>1</span>
          </div>
          <div class="spacer"></div>
          <span>Sélectionnez les lampes à corriger :</span>
          <div class="checkboxes listeCheckboxesCorrTurbidite">

          </div>
          <div class="spacer"></div>
          <div class="bouton" :class="{ 'disabled': props.affichageVisualisation.lampesSelectionneesCorrTurbidite.length === 0 }" @click="affichageVisualisation.declencherCorrectionTurbidite">Calculer</div>
        </div>
        <CommunCarousel :affichageVisualisation="affichageVisualisation"  :controlleurVisualisation="controlleurVisualisation" :choisirFichier="choisirFichier"/>
      </div>
    </SplideSlide>

    <!-- Correction des interférences -->
    <SplideSlide class="page">
      <HeaderCarousel/>
      <div class="cards">
        <div class="card main">
          <b>Correction des interférences</b>
          <div class="spacer"></div>
          <span>Sélectionnez le nombre de traceurs présents :</span>
          <div class="checkboxes">
            <label class="checkNbLabel" @click="affichageVisualisation.selectionnerNombreTraceursCorrectionInterferences(1)">
              <input type="checkbox" value="" class="one-traceur checkNb" id="one-traceur-checkbox">
              1 traceur
            </label>
            <label class="checkNbLabel" @click="affichageVisualisation.selectionnerNombreTraceursCorrectionInterferences(2)">
              <input type="checkbox" value="" class="two-traceur checkNb" id="two-traceur-checkbox">
              2 traceurs
            </label>
          </div>
          <div class="spacer"></div>
          <span>Sélectionnez les traceurs concernés :</span>
          <div class="multiple listeTraceursInterferences"></div>
          <div class="spacer"></div>
          <div class="bouton" :class="{ 'disabled': props.affichageVisualisation.traceursCorrectionInterferences.length === 0 }" @click="affichageVisualisation.declencherCorrectionInterferences">Calculer</div>
        </div>
        <CommunCarousel :affichageVisualisation="affichageVisualisation"  :controlleurVisualisation="controlleurVisualisation" :choisirFichier="choisirFichier"/>
      </div>
    </SplideSlide>

    <!-- Correction du bruit de fond (n'apparait que si la correction des interférences a été effectuée au préalable) -->
    <SplideSlide class="page" v-if="affichageVisualisation.estEffectueeCorrectionInterferences">
      <HeaderCarousel/>
      <div class="cards">
        <div class="card main">
          <b>Correction du bruit de fond</b>
          <span>Sélectionnez la période influencée par le traceur :</span>
          <div class="bouton" @click="affichageVisualisation.selectionnerPeriodeCorrectionBruit">Sélection graphique</div>
          <div class="wrap-dates">
            <span>Du :</span>
            <input id="debutSelection" type="datetime-local">
            <span class="bouton" @click="affichageVisualisation.dateDebutSelectionneePremiereDate">Depuis le début</span>
          </div>
          <div class="wrap-dates">
            <span>Au :</span>
            <input id="finSelection" type="datetime-local">
            <span class="bouton" @click="affichageVisualisation.dateFinSelectionneeDerniereDate">Jusqu'à la fin</span>
          </div>
          <span>Sélectionnez les variables explicatives :</span>
          <div class="checkboxes">
            <label>
              <input type="checkbox" value="L1">
              L1
            </label>
            <label>
              <input type="checkbox" value="L2">
              L2
            </label>
            <label>
              <input type="checkbox" value="L3">
              L3
            </label>
            <label>
              <input type="checkbox" value="L4">
              L4
            </label>
          </div>
          <div class="bouton">Calculer</div>
        </div>
        <CommunCarousel :affichageVisualisation="affichageVisualisation"  :controlleurVisualisation="controlleurVisualisation" :choisirFichier="choisirFichier"/>
      </div>
    </SplideSlide>

    <!-- Conversion en concentration -->
    <SplideSlide class="page">
      <HeaderCarousel/>
      <div class="cards">
        <div class="card main">
          <b>Conversion en concentration</b>
          <span>Convertissez les courbes de vos traceurs en concentration</span>
          <div class="spacer"></div>
          <span>Sélectionnez le traceur à convertir</span>
          <div class="checkboxes">
            <label>
              <input type="checkbox" value="L1">
              Uranine
            </label>
            <label>
              <input type="checkbox" value="L2">
              Sulfo
            </label>
            <label>
              <input type="checkbox" value="L2">
              Aminogacid
            </label>
            <label>
              <input type="checkbox" value="L2">
              Turbidité
            </label>
          </div>
          <div class="spacer"></div>
          <div class="bouton">Convertir</div>
        </div>
        <CommunCarousel :affichageVisualisation="affichageVisualisation"  :controlleurVisualisation="controlleurVisualisation" :choisirFichier="choisirFichier"/>
      </div>
    </SplideSlide>

    <!-- Export des données -->
    <SplideSlide class="page">
      <HeaderCarousel/>
      <div class="cards">
        <div class="card">
          <b>Export des données au format CSV</b>
          <div class="wrap-toogle">
            <ToggleSwitch/>
            <span>Exporter la liste des calculs effectués</span>
          </div>
          <div class="bouton">Exporter</div>
        </div>
        <div class="card">
          <b>Export des données au format CSV TRAC</b>
          <div class="spacer"></div>
          <span>Sélectionnez le traceur à exporter :</span>
          <div class="checkboxes">
            <label>
              <input type="checkbox" value="L1">
              Uranine
            </label>
            <label>
              <input type="checkbox" value="L2">
              Sulfo
            </label>
            <label>
              <input type="checkbox" value="L2">
              Aminogacid
            </label>
            <label>
              <input type="checkbox" value="L2">
              Turbidité
            </label>
          </div>
          <div class="spacer"></div>
          <div class="bouton">Exporter</div>
        </div>
        <CommunCarousel :affichageVisualisation="affichageVisualisation"  :controlleurVisualisation="controlleurVisualisation" :choisirFichier="choisirFichier"/>
      </div>
    </SplideSlide>

    <!-- Suppression de courbes -->
    <SplideSlide class="page">
      <HeaderCarousel/>
      <div class="cards">
        <div class="card main">
          <b>Supprimer des courbes</b>
          <div class="spacer"></div>
          <span>Sélectionnez les courbes à supprimer :</span>
          <div class="checkboxes">
            <label>
              <input type="checkbox" value="L1">
              Uranine
            </label>
            <label>
              <input type="checkbox" value="L2">
              Sulfo
            </label>
            <label>
              <input type="checkbox" value="L2">
              Aminogacid
            </label>
            <label>
              <input type="checkbox" value="L2">
              Turbidité
            </label>
            <label>
              <input type="checkbox" value="L2">
              L1
            </label>
            <label>
              <input type="checkbox" value="L2">
              L2
            </label>
            <label>
              <input type="checkbox" value="L2">
              L3
            </label>
            <label>
              <input type="checkbox" value="L2">
              L4
            </label>
          </div>
          <div class="spacer"></div>
          <div class="bouton">Supprimer</div>
        </div>
        <CommunCarousel :affichageVisualisation="affichageVisualisation"  :controlleurVisualisation="controlleurVisualisation" :choisirFichier="choisirFichier"/>
      </div>
    </SplideSlide>
  </Splide>
  <input style="display: none" type="file" id="inputCalibration" accept=".dat,.csv" @change="handleFileSelection">
</template>

<style>
@import "@/assets/styles/carousel.css";

.container {
  height: calc(100vh - 80px);
  display: flex;
  padding: 20px;
}
</style>