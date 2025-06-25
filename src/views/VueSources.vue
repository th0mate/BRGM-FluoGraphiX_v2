<script setup lang="ts">

import router from "@/router";
</script>

<template>
  <div class="bannierePage">
    <img src="@/assets/img/hydro_pictures/img14.jpg" alt="Sources">
    <div class="contenu">
      <p><span @click="router.push('accueil')"><span></span>Accueil</span> <strong> / Sources du Contenu</strong>
      </p>
      <h2>Sources du Contenu</h2>
      <span class="auteur"><img src="@/assets/img/icons/auteur.png" class="info" alt=""> <h3>© BRGM - François Michel, Chamonix, Haute-Savoie, 2008.</h3></span>
    </div>
  </div>
  <div class="cookies">
    <h1 class="titreBarre">Crédits <span class="orange">Photos</span></h1>
    <p>Le crédit photo des images utilisées comme bannières dans les pages est réputé être le suivant : © BRGM</p>
    <p>D'autres photos et illustrations sont utilisées ponctuellement dans certaines pages. Elles portent notamment les
      crédits suivants :</p>
    <ul>
      <li>© Storyset</li>
      <li>© Loading.io</li>
      <li>© Pana sur Storyset</li>
      <li>© Cuate sur Storyset</li>
      <li>© Freepik sur Flaticon</li>
      <li>© Anggara sur Flaticon</li>
      <li>© Smashicons sur Flaticon</li>
      <li>© Pavel Kozlov sur Flaticon</li>
      <li>© Dmytro Vyshnevskyi sur Flaticon</li>
      <li>© Itim2101 sur Flaticon</li>
      <li>© Itim2101 sur Flaticon</li>
      <li>© Catalin Fertu sur Flaticon</li>
      <li>© Freepik sur Freepik</li>
      <li>© Studiogstock sur Freepik</li>
    </ul>
  </div>
</template>

<style scoped>
@import "@/assets/styles/cookies.css";
</style>