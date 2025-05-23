<script setup lang="ts">

import {RouterLink} from "vue-router";
</script>

<template>
  <section class="main-pres">
    <h1>FluoGraphiX : l'outil de visualisation et de traitement de données issues de fluorimètres</h1>
    <span class="bouton-main">DÉCOUVRIR</span>

    <div class="wrap-cards">
      <div class="card">
        <span class="color"></span>
        <span>Visualisez, corrigez et convertissez vos données de mesure</span>
        <RouterLink to="/visualisation" class="animated-link">Voir plus <img src="@/assets/img/icons/fleche-droite.png"
                                                                             alt=""></RouterLink>
      </div>

      <div class="card">
        <span class="color"></span>
        <span>Consultez vos données de calibration et vérifiez leur conformité</span>
        <RouterLink to="/calibration" class="animated-link">Voir plus <img src="@/assets/img/icons/fleche-droite.png"
                                                                           alt=""></RouterLink>
      </div>

      <div class="card">
        <span class="color"></span>
        <span>Consultez la documentation pour obtenir les réponses à vos questions</span>
        <RouterLink to="/documentation" class="animated-link">Voir plus <img src="@/assets/img/icons/fleche-droite.png"
                                                                             alt=""></RouterLink>
      </div>
    </div>
  </section>

  <section class="section-accueil">
    <img src="@/assets/img/illus/mockup1.png" alt="">
    <div>
      <h1>Bienvenue sur<br> <span class="orange">FluoGraphiX</span> !</h1>
      <span class="texte-gris-simple">Une nouvelle façon de traiter vos données issues de campagnes de traçage hydrogéologique.</span>
      <div class="wrap-boutons">
        <span class="bouton boutonFonce">TÉLÉCHARGER</span>
        <span class="bouton boutonClair">VOIR PLUS</span>
      </div>
    </div>
  </section>

  <section class="highlights">
    <h2 class="grand-titre">Des fonctionnalités<br> <span class="orange">innovantes</span></h2>

    <div class="grid-highlights">

      <div class="hightlight">
        <img src="@/assets/img/higtlights/mobile.png" alt=""/>
        <h4>Mobile, comme vous</h4>
        <span class="texte-gris-simple">Disponible sur tous vos appareils : PC, téléphones, tablettes, même sans connexion internet</span>
      </div>
      <div class="hightlight">
        <img src="@/assets/img/higtlights/flexible.png" alt=""/>
        <h4>Polyvalent</h4>
        <span class="texte-gris-simple">FluoGraphiX prend en charge les fichiers DAT, CSV, XML et MV pour afficher vos données</span>
      </div>
      <div class="hightlight">
        <img src="@/assets/img/higtlights/puzzle.png" alt=""/>
        <h4>Pensé pour vos outils</h4>
        <span class="texte-gris-simple">Exports des données de concentration compatibles avec l'outil du BRGM TRAC</span>
      </div>
      <div class="hightlight">
        <img src="@/assets/img/higtlights/compteur.png" alt=""/>
        <h4>Haute performances</h4>
        <span class="texte-gris-simple">Des performances optimales, même avec des fichiers volumineux complexes à traiter</span>
      </div>
      <div class="hightlight">
        <img src="@/assets/img/higtlights/csv.png" alt=""/>
        <h4>Calibration simplifiée</h4>
        <span
            class="texte-gris-simple">Profitez de la prise en charge des fichiers de calibration au format simplifié CSV pour éditer vos données de calibration</span>
      </div>
      <div class="hightlight">
        <img src="@/assets/img/higtlights/hausse.png" alt=""/>
        <h4>Graphiques interactifs</h4>
        <span class="texte-gris-simple">Profitez du zoom et du déplacement sur les graphiques pour analyser de près toutes vos données</span>
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