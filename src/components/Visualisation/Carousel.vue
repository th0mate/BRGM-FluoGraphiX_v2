<script setup lang="ts">
import {Splide, SplideSlide} from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';
import HeaderCarousel from "@/components/Visualisation/HeaderCarousel.vue"
import CommunCarousel from "@/components/Visualisation/CommunCarousel.vue"

</script>

<template>
  <div class="container">
    <Splide :options="{ rewind: true }" class="carousel">

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

      <SplideSlide class="page">
        <HeaderCarousel/>
        <div class="cards">
          <div class="card">
            <b>Correction de la turbidité</b>
            <span>Corrigez l'influence de la turbidité sur vos courbes</span>
            <br>
            <span>Sélectionnez le niveau de correction à appliquer :</span>
            <div class='range'>
              <input id="inputRange" type="range" min='0' max='2' step='0.1' />
              <span>1</span>
            </div>
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