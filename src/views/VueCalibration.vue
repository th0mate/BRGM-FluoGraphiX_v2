<script setup lang="ts">

</script>

<template>
  <section class="glassmorphism">

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
            <li>Fichiers CSV issus de FluoGraphiX. En savoir plus sur les <a href="">fichiers CSV de calibration</a> de FluoGraphiX</li>
          </ul>
        </div>

        <span class="bouton boutonFonce">COMMENCER</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import "@/assets/styles/glassmorphism.css";

.glassmorphism {
  background-image: url('@/assets/img/hydro_pictures/img10.jpg');
}
</style>