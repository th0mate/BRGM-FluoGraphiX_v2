<script setup lang="ts">
import {Splide, SplideSlide} from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';
import HeaderCarousel from "@/components/Visualisation/HeaderCarousel.vue"
import CommunCarousel from "@/components/Visualisation/CommunCarousel.vue"
import {onMounted, ref} from "vue";

const props = defineProps<{ affichageVisualisation: AffichageVisualisation }>();

const splideRef = ref();

onMounted(() => {
  props.affichageVisualisation.preparerInputRange()
});

</script>

<template>
  <div class="container">
    <Splide :options="{ rewind: true }" class="carousel" ref="splideRef">

      <!-- Slide d'accueil : reset graphique et renommage des courbes -->
      <SplideSlide class="page">
        <HeaderCarousel/>
        <div class="cards">
          <div class="card">
            <b>Bienvenue dans l'utilitaire de calculs et d'export de FluoGraphiX</b>
            <span>Réalisez ici les différentes opérations de correction et d'export de vos courbes</span>
            <div class="bouton">Réinitialiser le graphique</div>
          </div>
          <div class="card">
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
                  <option value="">Test...</option>
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
          <CommunCarousel/>
        </div>
      </SplideSlide>

      <!-- Correction de la turbidité -->
      <SplideSlide class="page">
        <HeaderCarousel/>
        <div class="cards">
          <div class="card main">
            <b>Correction de la turbidité</b>
            <span>Corrigez l'influence de la turbidité sur vos courbes</span>
            <spacer/>
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
            <spacer/>
            <span>Sélectionnez les lampes à corriger :</span>
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
            <spacer/>
            <div class="bouton">Calculer</div>
          </div>
          <CommunCarousel/>
        </div>
      </SplideSlide>

      <!-- Correction des interférences -->
      <SplideSlide class="page">
        <HeaderCarousel/>
        <div class="cards">
          <div class="card main">
            <b>Correction des interférences</b>
            <span>Corrigez les interférences entre vos différents traceurs</span>
            <spacer/>
            <span>Sélectionnez le nombre de traceurs présents :</span>
            <div class="checkboxes">
              <label>
                <input type="checkbox" value="L1">
                1 traceur
              </label>
              <label>
                <input type="checkbox" value="L2">
                2 traceurs
              </label>
            </div>
            <spacer/>
            <span>Sélectionnez les traceurs concernés :</span>
            <div class="multiple">
              <div>
                <select><option selected disabled>Traceur 1</option></select>
                <select><option selected>100ppb</option></select>
              </div>
              <span class="separator"></span>
              <div>
                <select><option selected disabled>Traceur 2</option></select>
                <select><option selected>100ppb</option></select>
              </div>
            </div>
            <spacer/>
            <div class="bouton">Calculer</div>
          </div>
          <CommunCarousel/>
        </div>
      </SplideSlide>

      <!-- Correction du bruit de fond (n'apparait que si la correction des interférences a été effectuée au préalable) -->
      <SplideSlide class="page" v-if="affichageVisualisation.estEffectueeCorrectionInterferences">
        <HeaderCarousel/>
        <div class="cards">
          <div class="card main">
            <b>Correction du bruit de fond</b>
            <span>Sélectionnez la période influencée par le traceur :</span>
            <div class="bouton">Sélection graphique</div>
            <div class="wrap-dates">
              <span>Du :</span>
              <input type="datetime-local">
              <span class="bouton">Depuis le début</span>
            </div>
            <div class="wrap-dates">
              <span>Au :</span>
              <input type="datetime-local">
              <span class="bouton">Jusqu'à la fin</span>
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
          <CommunCarousel/>
        </div>
      </SplideSlide>
    </Splide>
  </div>
</template>

<style>
@import "@/assets/styles/carousel.css";

.container {
  height: calc(100vh - 80px);
  display: flex;
  padding: 20px;
}
</style>