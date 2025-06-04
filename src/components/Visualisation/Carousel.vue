<script setup lang="ts">
import {Splide, SplideSlide} from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';

</script>

<template>
  <div class="container">
  <Splide :options="{ rewind: true }" class="carousel">
    <SplideSlide class="page">
      <div class="header">
        <span class="text">Utilitaire de calculs et d'export</span>
        <span>
        <span class="color"></span>
        <span class="color"></span>
        <span class="color"></span>
      </span>
      </div>
      <div class="card">
        <b>Bienvenue dans l'utilitaire de calculs et d'export de FluoGraphiX</b>
        <span>Réalisez ici les différentes opérations de correction et d'export de vos courbes</span>
        <div class="bouton">Réinitialiser le graphique</div>
      </div>
      <div class="card">
        <b>Vous devez renommer vos courbes en fonction de vos données de calibration :</b>
        <table>
          <tr>
            <th>Label</th>
            <th>Courbe</th>
          </tr>
          <tr>
            <td>L1</td>
            <td><select></select></td>
          </tr>
          <tr>
            <td>L2</td>
            <td><select></select></td>
          </tr>
          <tr>
            <td>L3</td>
            <td><select></select></td>
          </tr>
          <tr>
            <td>L4</td>
            <td><select></select></td>
          </tr>
        </table>
      </div>
      <div class="card anomalie">
        <b>Anomalies détectées :</b>
        <img src="@/assets/img/popup/warning.png" alt="" class="icone">
        <b>Données potentiellement incohérentes détectées</b>
        <span>Les données calculées indiquent une potentielle erreur dans les données de calibration importées. Assurez-vous qu'elles soient correctes.</span>
      </div>
      <div class="actions card">
        <img class="action" src="@/assets/img/icons/importer.png" alt="Importer">
        <img class="action" src="@/assets/img/icons/x_axis.png" alt="Importer">
        <img class="action" src="@/assets/img/icons/y_axis.png" alt="Importer">
        <img class="action" src="@/assets/img/icons/circulaire.png" alt="Importer">
        <img class="action" src="@/assets/img/icons/copier.png" alt="Importer">
      </div>
    </SplideSlide>
    <SplideSlide>
      <p>salut</p>
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