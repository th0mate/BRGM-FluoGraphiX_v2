<script setup lang="ts">

import {RouterLink} from "vue-router";
import Router from "@/router";
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
        <span class="bouton boutonFonce" @click="Router.push('/telecharger')">TÉLÉCHARGER</span>
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

  <section class="section-accueil reverse orange">
    <img src="@/assets/img/illus/screen1.png" alt="">
    <div>
      <h2>Installez <span class="orange">FluoGraphiX</span><br> maintenant</h2>
      <span class="texte-gris-simple">Une nouvelle façon de traiter vos données issues de campagnes de traçage hydrogéologique.</span>
      <div class="wrap-boutons">
        <span class="bouton boutonFonce" @click="Router.push('/telecharger')">TÉLÉCHARGER</span>
        <span class="bouton boutonClair">VOIR PLUS</span>
      </div>
    </div>
  </section>

  <section class="section-accueil reverse white designed">
    <img src="@/assets/img/illus/design1.png" alt="">
    <div>
      <h2><span class="orange">Visualisation</span> de vos<br> données</h2>
      <span class="texte-gris-simple">Visualisez vos données de mesure, en profitant de graphiques interactifs fluides.</span>
      <span class="texte-gris-simple">De nombreuses options de calculs sont possibles : correction de turbidité, de bruit de fond, d'interférences et conversion en concentrations.</span>
      <span class="texte-gris-simple">Vous pouvez également exporter vos données au format CSV ou TRAC.</span>
      <div class="wrap-boutons" @click="Router.push('/visualisation')">
        <span class="bouton boutonFonce">ESSAYER</span>
      </div>
    </div>
  </section>

  <section class="section-accueil designed">
    <img src="@/assets/img/illus/design2.png" alt="">
    <div>
      <h2>Données de <br><span class="orange">calibration</span></h2>
      <span class="texte-gris-simple">Consultez vos données de calibration, en profitant de tableaux simplifiées et de fonctionnalités innovantes</span>
      <span class="texte-gris-simple">Vérifiez en direct l'intégrité de vos données de calibration grâce aux courbes dédiées : soyez alertés en cas de suspicion de données invalides.</span>
      <div class="wrap-boutons" @click="Router.push('/calibration')">
        <span class="bouton boutonFonce">ESSAYER</span>
      </div>
    </div>
  </section>

  <section class="section-accueil designed gris">
    <img src="@/assets/img/illus/design3.png" alt="">
    <div>
      <h2>Vous aussi, <br><span class="orange">contribuez</span> !</h2>
      <span class="texte-gris-simple">Rendez-vous sur le Github pour participer au projet, suivre les mises à jour, signaler des bugs ou proposer des idées... Et bien plus encore !</span>
      <div class="wrap-boutons">
        <a href="https://github.com/th0mate/BRGM-FluoGraphiX_v2" target="_blank"class="bouton boutonFonce">VOIR PLUS</a>
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