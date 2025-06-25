<script setup lang="ts">
import router from '@/router';
</script>

<template>
  <div class="bannierePage">
    <img src="@/assets/img/hydro_pictures/img13.jpg" alt="Sources">
    <div class="contenu">
      <h2>Gestion des <span class="orange">cookies</span></h2>
      <p><span @click="router.push('accueil')"><span></span>Accueil</span> <strong> / Gestion des Cookies</strong></p>
      <span class="auteur"><img src="@/assets/img/icons/auteur.png" class="info" alt=""> <h3>© AdobeStock - jerry, Arizona, Etats-Unis, 2017.</h3></span>
    </div>
  </div>

  <div class="cookies">
    <h2>Certaines fonctionnalités de ce site reposent sur l’usage de témoins de connexion, dits "cookies". Vous pouvez
      donner, refuser ou retirer votre consentement au dépôt de ces cookies sur votre ordinateur, votre mobile ou votre
      tablette, à tout moment, soit globalement soit service par service.</h2>

    <h1 class="titreBarre">Cookies <span class="orange">indispensables</span> au fonctionnement du site</h1>
    <p>Certains cookies sont indispensables au bon fonctionnement du site. Il s'agit notamment des cookies d'équilibrage
      de charge ou encore des cookies qui conservent en mémoire votre acceptation ou votre refus de l'utilisation de
      cookies tiers.</p>
    <p>Ces traceurs ne nécessitent pas de consentement préalable et ne peuvent être désactivés.</p>

    <h1 class="titreBarre">Cookies de mesure <span class="orange">d'audience</span></h1>
    <p>Les services de mesure d'audience sont nécessaires au fonctionnement du site en permettant sa bonne
      administration.</p>
    <p>Les données collectées (zone géographique, pages visitées, temps passé, etc.) sont enregistrées et conservées sur
      les serveurs du BRGM, pour une durée maximum de treize (13) mois. Ces informations sont strictement anonymes, ne
      permettent pas d'identifier les utilisateurs ni de suivre leur navigation sur d'autres sites. Les informations
      recueillies ne seront utilisées que pour les seuls besoins de l'analyse de la fréquentation des sites du BRGM.</p>

    <h1 class="titreBarre">Cookies <span class="orange">tiers</span></h1>
    <p>D'autres cookies sont utilisés pour vous permettre de visualiser directement sur notre site du contenu hébergé
      par des tiers.</p>
    <p>Vous avez la possibilité d'accepter ou de vous opposer au dépôt de ces cookies tiers, via le panneau de gestion
      des cookies accessible via le bandeau affiché lors de votre arrivée sur le site.</p>
  </div>
</template>

<style scoped>
@import "@/assets/styles/cookies.css";
</style>