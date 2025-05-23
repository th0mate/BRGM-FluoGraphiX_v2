<script setup lang="ts">

import {RouterLink} from "vue-router";
</script>

<template>
  <footer>
    <img class="logo" src="@/assets/img/cosmetics/banniereSmall.svg" alt="">
    <div class="wrap-cards">
      <div class="card">
        <span class="color"></span>
        <span>Gestion des cookies</span>
        <RouterLink to="/documentation" class="animated-link">Voir plus <img src="@/assets/img/icons/fleche-droite.png"
                                                                             alt=""></RouterLink>
      </div>

      <div class="card">
        <span class="color"></span>
        <span>Mentions légales & crédits</span>
        <RouterLink to="/documentation" class="animated-link">Voir plus <img src="@/assets/img/icons/fleche-droite.png"
                                                                             alt=""></RouterLink>
      </div>

      <div class="card">
        <span class="color"></span>
        <span>Sources du contenu</span>
        <RouterLink to="/documentation" class="animated-link">Voir plus <img src="@/assets/img/icons/fleche-droite.png"
                                                                             alt=""></RouterLink>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  background-image: url('@/assets/img/hydro_pictures/img1.jpg');
}
</style>