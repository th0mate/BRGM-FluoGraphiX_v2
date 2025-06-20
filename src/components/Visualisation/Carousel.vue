<script setup lang="ts">
import {Splide, SplideSlide} from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';
import HeaderCarousel from "@/components/Visualisation/HeaderCarousel.vue"
import CommunCarousel from "@/components/Visualisation/CommunCarousel.vue"
import {onMounted, ref, computed, watch, nextTick} from "vue";
import ToggleSwitch from 'primevue/toggleswitch';
import Session from '@/assets/js/Session/Session';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps<{ affichageVisualisation: any, controlleurVisualisation: any, choisirFichier: Function }>();

const splideRef = ref();
const isCalibrationLinked = ref(props.controlleurVisualisation.calibrationEstLieeGraphique);
const hasCalibrationFile = ref(Session.getInstance().contenuFichierCalibration !== '');

function updateDateInjection(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input || !input.value) return;

  const dateValue = input.value;
  props.affichageVisualisation.dateInjectionTrac = dateValue;

  nextTick(() => {
    if (props.affichageVisualisation.dateInjectionTrac !== dateValue) {
      props.affichageVisualisation.dateInjectionTrac = dateValue;
    }

    const exportButton = document.getElementById('declencherExportTRAC');
    if (exportButton &&
      props.affichageVisualisation.traceurSelectionneExportTRAC !== null &&
      props.affichageVisualisation.dateInjectionTrac !== null) {
      exportButton.classList.remove('disabled');
    }
  });
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
</script>

<template>
  <Splide :options="splideOptions" class="carousel" ref="splideRef">

    <!-- Slide d'accueil : reset graphique et renommage des courbes -->
    <SplideSlide class="page">
      <HeaderCarousel/>
      <div class="cards">
        <div class="card">
          <b>{{ t('carousel.home.welcome.title') }}</b>
          <span>{{ t('carousel.home.welcome.description') }}</span>
          <div class="bouton" @click="controlleurVisualisation.reinitialiserGraphique">{{ t('carousel.home.welcome.resetChart') }}</div>
        </div>
        <div class="card" v-if="!isCalibrationLinked && hasCalibrationFile">
          <b>{{ t('carousel.home.renaming.title') }}</b>
          <table>
            <thead>
            <tr>
              <th>{{ t('carousel.home.renaming.labelColumn') }}</th>
              <th>{{ t('carousel.home.renaming.curveColumn') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>L1</td>
              <td><select>
                <option value="" disabled selected>{{ t('carousel.home.renaming.select') }}</option>
              </select></td>
            </tr>
            <tr>
              <td>L2</td>
              <td><select>
                <option value="" disabled selected>{{ t('carousel.home.renaming.select') }}</option>
              </select></td>
            </tr>
            <tr>
              <td>L3</td>
              <td><select>
                <option value="" disabled selected>{{ t('carousel.home.renaming.select') }}</option>
              </select></td>
            </tr>
            <tr>
              <td>L4</td>
              <td><select>
                <option value="" disabled selected>{{ t('carousel.home.renaming.select') }}</option>
              </select></td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="card" v-else-if="isCalibrationLinked && hasCalibrationFile">
          <div class="wrap-status">
            <img src="@/assets/img/popup/success.png" alt="">
            <div class="spacer"></div>
            <b>{{ t('carousel.home.linkedSuccess.title') }}</b>
          </div>
        </div>

        <div class="card" v-else>
          <div class="wrap-status">
            <img src="@/assets/img/popup/error.png" alt="">
            <div class="spacer"></div>
            <b>{{ t('carousel.home.noCalibration.title') }}</b>
            <div class="spacer"></div>
            <div class="bouton" @click="initCalibrationDepuisVisualisation">{{ t('carousel.home.noCalibration.import') }}</div>
          </div>
        </div>
        <CommunCarousel :affichageVisualisation="affichageVisualisation"
                        :controlleurVisualisation="controlleurVisualisation" :choisirFichier="choisirFichier"/>
      </div>
    </SplideSlide>

    <!-- Correction de la turbidité -->
    <SplideSlide class="page">
      <HeaderCarousel/>
      <div class="cards">
        <div class="card main">
          <b>{{ t('carousel.turbidity.title') }}</b>
          <span>{{ t('carousel.turbidity.description') }}</span>
          <div class="spacer"></div>
          <span>{{ t('carousel.turbidity.correctionLevel') }}</span>
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
          <span>{{ t('carousel.turbidity.lampsToCorrect') }}</span>
          <div class="checkboxes listeCheckboxesCorrTurbidite">

          </div>
          <div class="spacer"></div>
          <div class="bouton" id="declencherCorrectionTurbidite"
               :class="{ 'disabled': props.affichageVisualisation.lampesSelectionneesCorrTurbidite.length === 0 }"
               @click="affichageVisualisation.declencherCorrectionTurbidite">{{ t('carousel.commons.calculate') }}
          </div>
        </div>
        <CommunCarousel :affichageVisualisation="affichageVisualisation"
                        :controlleurVisualisation="controlleurVisualisation" :choisirFichier="choisirFichier"/>
      </div>
    </SplideSlide>

    <!-- Correction des interférences -->
    <SplideSlide class="page">
      <HeaderCarousel/>
      <div class="cards">
        <div class="card main">
          <b>{{ t('carousel.interference.title') }}</b>
          <div class="spacer"></div>
          <span>{{ t('carousel.interference.tracersNumber') }}</span>
          <div class="checkboxes">
            <label class="checkNbLabel" id="unTraceurInterf"
                   @click="affichageVisualisation.selectionnerNombreTraceursCorrectionInterferences(1)">
              <input type="checkbox" value="" class="one-traceur checkNb" id="one-traceur-checkbox">
              {{ t('carousel.interference.oneTracer') }}
            </label>
            <label class="checkNbLabel" id="deuxTraceurInterf"
                   @click="affichageVisualisation.selectionnerNombreTraceursCorrectionInterferences(2)">
              <input type="checkbox" value="" class="two-traceur checkNb" id="two-traceur-checkbox">
              {{ t('carousel.interference.twoTracers') }}
            </label>
          </div>
          <div class="spacer"></div>
          <span>{{ t('carousel.interference.tracersSelection') }}</span>
          <div class="multiple listeTraceursInterferences"></div>
          <div class="spacer"></div>
          <div class="bouton" id="declencherCorrectionInterf"
               :class="{ 'disabled': props.affichageVisualisation.traceursCorrectionInterferences.length === 0 }"
               @click="affichageVisualisation.declencherCorrectionInterferences">{{ t('carousel.commons.calculate') }}
          </div>
        </div>
        <CommunCarousel :affichageVisualisation="affichageVisualisation"
                        :controlleurVisualisation="controlleurVisualisation" :choisirFichier="choisirFichier"/>
      </div>
    </SplideSlide>

    <!-- Correction du bruit de fond (n'apparait que si la correction des interférences a été effectuée au préalable) -->
    <SplideSlide class="page" v-if="affichageVisualisation.estEffectueeCorrectionInterferences">
      <HeaderCarousel/>
      <div class="cards">
        <div class="card main">
          <b>{{ t('carousel.backgroundNoise.title') }}</b>
          <span>{{ t('carousel.backgroundNoise.selectPeriod') }}</span>
          <div class="bouton" @click="affichageVisualisation.selectionnerPeriodeCorrectionBruit">{{ t('carousel.backgroundNoise.graphicalSelection') }}
          </div>
          <div class="wrap-dates">
            <span>{{ t('carousel.backgroundNoise.from') }}</span>
            <input id="debutSelection" type="datetime-local"
                   @change="(e) => e.target && affichageVisualisation.dateDebutDepuisInput((e.target as HTMLInputElement).value)">
            <span class="bouton"
                  @click="affichageVisualisation.dateDebutSelectionneePremiereDate">{{ t('carousel.backgroundNoise.fromBeginning') }}</span>
          </div>
          <div class="wrap-dates">
            <span>{{ t('carousel.backgroundNoise.to') }}</span>
            <input id="finSelection" type="datetime-local"
                   @change="(e) => e.target && affichageVisualisation.dateFinDepuisInput((e.target as HTMLInputElement).value)">
            <span class="bouton" @click="affichageVisualisation.dateFinSelectionneeDerniereDate">{{ t('carousel.backgroundNoise.toEnd') }}</span>
          </div>
          <span>{{ t('carousel.backgroundNoise.explanatoryVariables') }}</span>
          <div class="checkboxes variables-explicatives">
          </div>
          <div class="bouton" id="declencherCorrectionBk" @click="affichageVisualisation.declencherCorrectionBruitDeFond">{{ t('carousel.commons.calculate') }}</div>
        </div>
        <CommunCarousel :affichageVisualisation="affichageVisualisation"
                        :controlleurVisualisation="controlleurVisualisation" :choisirFichier="choisirFichier"/>
      </div>
    </SplideSlide>

    <!-- Conversion en concentration -->
    <SplideSlide class="page">
      <HeaderCarousel/>
      <div class="cards">
        <div class="card main">
          <b>{{ t('carousel.concentration.title') }}</b>
          <span>{{ t('carousel.concentration.description') }}</span>
          <div class="spacer"></div>
          <span>{{ t('carousel.concentration.selectTracer') }}</span>
          <div class="checkboxes listeCheckboxesConversion">
          </div>
          <div class="spacer"></div>
          <div class="bouton" id="declencherConversion" @click="affichageVisualisation.appliquerConversionConcentration"
               :class="{ 'disabled': props.affichageVisualisation.traceurPourConversion === null }">{{ t('carousel.concentration.convert') }}
          </div>
        </div>
        <CommunCarousel :affichageVisualisation="affichageVisualisation"
                        :controlleurVisualisation="controlleurVisualisation" :choisirFichier="choisirFichier"/>
      </div>
    </SplideSlide>

    <!-- Export des données -->
    <SplideSlide class="page">
      <HeaderCarousel/>
      <div class="cards">
        <div class="card">
          <b>{{ t('carousel.export.csvTitle') }}</b>
          <div class="wrap-toogle">
            <ToggleSwitch class="export-calculs-checkbox"
                          @change="(e) => affichageVisualisation.toggleExportCalculs(e)"/>
            <span>{{ t('carousel.export.exportCalculations') }}</span>
          </div>
          <div class="bouton" id="declencherExportCSV" @click="affichageVisualisation.declencherExportCSV">{{ t('carousel.export.export') }}</div>
        </div>
        <div class="card">
          <b>{{ t('carousel.export.tracTitle') }}</b>
          <div class="checkboxes listeTraceursExport">
          </div>
          <span v-if="props.affichageVisualisation.traceurSelectionneExportTRAC !== null">{{ t('carousel.export.injectionDate') }}</span>
          <input type="datetime-local" id="dateInjection" step="1"
                 v-if="props.affichageVisualisation.traceurSelectionneExportTRAC !== null"
                 :max="affichageVisualisation.dateMax"
                 @change="(e) => updateDateInjection(e)"
                 @input="(e) => updateDateInjection(e)"
                 :value="affichageVisualisation.dateInjectionTrac"/>
          <div class="spacer"></div>
          <div class="multiple trac">
            <div class="bouton" id="declencherExportTRAC" v-tooltip.top="t('carousel.export.exportAsFile')"
                 :class="{ 'disabled': props.affichageVisualisation.traceurSelectionneExportTRAC === null || affichageVisualisation.dateInjectionTrac === null }"
                 @click="affichageVisualisation.declencherExportTRAC">{{ t('carousel.export.export') }}</div>
            <div class="bouton" v-tooltip.top="t('carousel.export.copyToClipboard')" :class="{ 'disabled': props.affichageVisualisation.traceurSelectionneExportTRAC === null || affichageVisualisation.dateInjectionTrac === null}" @click="affichageVisualisation.declencherCopieExportTRAC">{{ t('buttons.copy') }}</div>
          </div>
        </div>
        <CommunCarousel :affichageVisualisation="affichageVisualisation"
                        :controlleurVisualisation="controlleurVisualisation" :choisirFichier="choisirFichier"/>
      </div>
    </SplideSlide>

    <!-- Suppression de courbes -->
    <SplideSlide class="page">
      <HeaderCarousel/>
      <div class="cards">
        <div class="card main">
          <b>{{ t('carousel.deleteCurves.title') }}</b>
          <div class="spacer"></div>
          <span>{{ t('carousel.deleteCurves.selectCurves') }}</span>
          <div class="checkboxes listeCourbes">
          </div>
          <div class="spacer"></div>
          <div class="bouton" id="declencherSuppression" :class="{ 'disabled': props.controlleurVisualisation.courbesSupprimees.length === 0 }" @click="affichageVisualisation.declencherSuppressionCourbes">{{ t('carousel.deleteCurves.delete') }}</div>
        </div>
        <CommunCarousel :affichageVisualisation="affichageVisualisation"
                        :controlleurVisualisation="controlleurVisualisation" :choisirFichier="choisirFichier"/>
      </div>
    </SplideSlide>
  </Splide>
  <input style="display: none" type="file" id="inputCalibration" accept=".dat,.csv" @change="handleFileSelection">
</template>

<style>
@import "@/assets/styles/carousel.css";
</style>