<script setup lang="ts">

</script>

<template>
  <section class="glassmorphism">

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

        <select>
          <option selected>jj/mm/aaaa</option>
          <option>mm/jj/aaaa</option>
        </select>

        <span class="bouton boutonFonce">COMMENCER</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import "@/assets/styles/glassmorphism.css";

.glassmorphism {
  background-image: url('@/assets/img/hydro_pictures/img13.jpg');
}
</style>