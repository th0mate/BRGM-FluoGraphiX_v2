<script setup lang="ts">

</script>

<template>
  <section class="main-pres">
    <h1>FluoGraphiX : l'outil de visualisation et de traitement de données issues de fluorimètres</h1>
    <span class="bouton-main">DÉCOUVRIR</span>

    <div class="wrap-cards">
      <div class="card">
        <span class="color"></span>
        <span>Visualisez, corrigez et convertissez vos données de mesure</span>
        <a class="animated-link" href="">Voir plus <img src="@/assets/img/icons/fleche-droite.png" alt=""></a>
      </div>

      <div class="card">
        <span class="color"></span>
        <span>Consultez vos données de calibration et vérifiez leur conformité</span>
        <a class="animated-link" href="">Voir plus <img src="@/assets/img/icons/fleche-droite.png" alt=""></a>
      </div>

      <div class="card">
        <span class="color"></span>
        <span>Consultez la documentation pour obtenir les réponses à vos questions</span>
        <a class="animated-link" href="">Voir plus <img src="@/assets/img/icons/fleche-droite.png" alt=""></a>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import "@/assets/styles/styleAccueil.css";

.main-pres {
  background-image: url('@/assets/img/hydro_pictures/img6.jpg');
}
</style>