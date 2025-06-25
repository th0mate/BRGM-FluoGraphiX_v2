<script setup lang="ts">
import router from "@/router";
</script>

<template>
  <div class="bannierePage">
    <img src="@/assets/img/hydro_pictures/img12.jpg" alt="Sources">
    <div class="contenu">
      <h2>Documentation de <span class="orange">FluoGraphiX</span></h2>
      <p><span @click="router.push('accueil')"><span></span>Accueil</span> <strong> / Documentation</strong></p>
      <span class="auteur"><img src="@/assets/img/icons/auteur.png" class="info" alt=""> <h3>© AdobeStock - jerry, Arizona, Etats-Unis, 2017.</h3></span>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/styles/documentation.css";
</style>

