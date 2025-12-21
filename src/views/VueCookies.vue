<script setup lang="ts">
import router from "@/router";

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};
</script>

<template>
  <div class="legal-page">
    <section class="legal-hero">
      <div class="legal-hero-inner">
        <h1 class="legal-hero-title">Gestion des <span class="accent">Cookies</span></h1>
        <p class="legal-hero-description">
          Certaines fonctionnalités de ce site reposent sur l'usage de témoins de connexion, dits "cookies".
          Vous pouvez donner, refuser ou retirer votre consentement au dépôt de ces cookies sur votre
          ordinateur, votre mobile ou votre tablette, à tout moment, soit globalement soit service par service.
        </p>
      </div>
    </section>

    <section class="legal-articles-grid">
      <article class="legal-article-card" @click="scrollToSection('article-1')">
        <img src="@/assets/img/icons/cookie.png" alt="" class="card-icon">
        <div class="card-content">
          <h3 class="card-title">Art. 1 – Cookies <span class="accent">Indispensables</span></h3>
          <p class="card-description">
            Cookies nécessaires au fonctionnement du site : équilibrage de charge, mémorisation des préférences.
          </p>
        </div>
      </article>

      <article class="legal-article-card" @click="scrollToSection('article-2')">
        <img src="@/assets/img/icons/chart.png" alt="" class="card-icon">
        <div class="card-content">
          <h3 class="card-title">Art. 2 – Mesure <span class="accent">d'Audience</span></h3>
          <p class="card-description">
            Collecte anonyme de données pour administrer le site et analyser sa fréquentation.
          </p>
        </div>
      </article>

      <article class="legal-article-card" @click="scrollToSection('article-3')">
        <img src="@/assets/img/icons/cookie.png" alt="" class="card-icon">
        <div class="card-content">
          <h3 class="card-title">Art. 3 – Cookies <span class="accent">Tiers</span></h3>
          <p class="card-description">
            Contenu hébergé par des tiers, avec possibilité d'accepter ou refuser leur dépôt.
          </p>
        </div>
      </article>
    </section>

    <main class="legal-content">
      <section id="article-1" class="legal-section">
        <h2 class="section-title">Article 1 : Cookies <span class="accent">Indispensables</span> au Fonctionnement</h2>
        <p class="section-text">
          Certains cookies sont indispensables au bon fonctionnement du site. Il s'agit notamment des cookies
          d'équilibrage de charge ou encore des cookies qui conservent en mémoire votre acceptation ou votre
          refus de l'utilisation de cookies tiers.
        </p>
        <p class="section-text">
          Ces traceurs ne nécessitent pas de consentement préalable et ne peuvent être désactivés. Ils permettent
          d'assurer la stabilité et la sécurité de votre navigation sur le site.
        </p>
      </section>

      <section id="article-2" class="legal-section">
        <h2 class="section-title">Article 2 : Cookies de Mesure <span class="accent">d'Audience</span></h2>
        <p class="section-text">
          Les services de mesure d'audience sont nécessaires au fonctionnement du site en permettant sa bonne
          administration. Ils nous aident à comprendre comment les visiteurs interagissent avec le site.
        </p>
        <p class="section-text">
          Les données collectées (zone géographique, pages visitées, temps passé, etc.) sont enregistrées et
          conservées sur les serveurs du BRGM, pour une durée maximum de treize (13) mois. Ces informations
          sont strictement anonymes, ne permettent pas d'identifier les utilisateurs ni de suivre leur
          navigation sur d'autres sites. Les informations recueillies ne seront utilisées que pour les seuls
          besoins de l'analyse de la fréquentation des sites du BRGM.
        </p>
      </section>

      <section id="article-3" class="legal-section">
        <h2 class="section-title">Article 3 : Cookies <span class="accent">Tiers</span></h2>
        <p class="section-text">
          D'autres cookies sont utilisés pour vous permettre de visualiser directement sur notre site du
          contenu hébergé par des tiers. Ces cookies peuvent collecter des informations sur votre navigation
          et vos préférences.
        </p>
        <p class="section-text">
          Vous avez la possibilité d'accepter ou de vous opposer au dépôt de ces cookies tiers, via le panneau
          de gestion des cookies accessible via le bandeau affiché lors de votre arrivée sur le site. Vous
          pouvez modifier vos préférences à tout moment.
        </p>
      </section>

      <div class="legal-back-top-container">
        <button class="legal-back-top" @click="scrollToTop">
          <span class="arrow-up">↑</span> Retour en haut
        </button>
      </div>
    </main>

    <footer class="legal-footer">
      <div class="footer-nav-row">
        <router-link to="/legal" class="footer-link">
          <img src="@/assets/img/icons/auction.png" alt=""> Mentions Légales
        </router-link>
        <router-link to="/credits" class="footer-link">
          <img src="@/assets/img/icons/image-gallery.png" alt="">
          Sources du Contenu
        </router-link>
      </div>
      <div class="footer-info">
        <p class="footer-text">
          <span class="underline">Éditeur</span> : BRGM, 3 avenue Claude-Guillemin, BP 36009, 45060 Orléans Cedex 02
        </p>
        <p class="footer-text">
          <span class="underline">Directeur de publication</span> : Pierre Vassal
        </p>
        <p class="footer-text">
          <strong>RCS</strong> : Orléans 582 056 149
        </p>
        <p class="footer-date">Dernière mise à jour : Décembre 2025</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import "@/assets/styles/cookies.css";
</style>