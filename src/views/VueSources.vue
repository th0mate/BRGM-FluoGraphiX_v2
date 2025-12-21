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
        <h1 class="legal-hero-title">Sources du <span class="accent">Contenu</span></h1>
        <p class="legal-hero-description">
          Découvrez les crédits des images et illustrations utilisées sur ce site. Nous remercions sincèrement
          les auteurs et les plateformes qui mettent à disposition ces ressources visuelles de qualité,
          permettant d'enrichir l'expérience utilisateur de notre application.
        </p>
      </div>
    </section>

    <section class="legal-articles-grid">
      <article class="legal-article-card" @click="scrollToSection('article-1')">
        <img src="@/assets/img/icons/image-gallery.png" alt="" class="card-icon">
        <div class="card-content">
          <h3 class="card-title">Crédits <span class="accent">Photos</span></h3>
          <p class="card-description">
            Images de bannières et photographies utilisées dans le site.
          </p>
        </div>
      </article>

      <article class="legal-article-card" @click="scrollToSection('article-2')">
        <img src="@/assets/img/icons/image-gallery.png" alt="" class="card-icon">
        <div class="card-content">
          <h3 class="card-title">Crédits <span class="accent">Illustrations</span></h3>
          <p class="card-description">
            Illustrations vectorielles et icônes graphiques.
          </p>
        </div>
      </article>
    </section>

    <main class="legal-content">
      <section id="article-1" class="legal-section">
        <h2 class="section-title">Crédits <span class="accent">Photos</span></h2>
        <p class="section-text">
          Le crédit photo des images utilisées comme bannières dans les pages est réputé être le suivant : © BRGM.
          Ces photographies proviennent de la photothèque du Bureau de Recherches Géologiques et Minières et
          illustrent les différentes thématiques liées aux sciences de la Terre et à l'hydrogéologie.
        </p>
        <p class="section-text">
          D'autres photos et illustrations sont utilisées ponctuellement dans certaines pages. Elles portent
          notamment les crédits suivants et proviennent de différentes sources libres de droits :
        </p>
      </section>

      <section id="article-2" class="legal-section">
        <h2 class="section-title">Crédits <span class="accent">Illustrations</span></h2>
        
        <h3 class="section-subtitle">Illustrations vectorielles</h3>
        <ul class="section-list">
          <li>© Storyset</li>
          <li>© Loading.io</li>
          <li>© Pana sur Storyset</li>
          <li>© Cuate sur Storyset</li>
        </ul>

        <h3 class="section-subtitle">Icônes et pictogrammes</h3>
        <ul class="section-list">
          <li>© Freepik sur Flaticon</li>
          <li>© Anggara sur Flaticon</li>
          <li>© Smashicons sur Flaticon</li>
          <li>© Pavel Kozlov sur Flaticon</li>
          <li>© Dmytro Vyshnevskyi sur Flaticon</li>
          <li>© Itim2101 sur Flaticon</li>
          <li>© Catalin Fertu sur Flaticon</li>
        </ul>

        <h3 class="section-subtitle">Autres ressources</h3>
        <ul class="section-list">
          <li>© Freepik sur Freepik</li>
          <li>© Studiogstock sur Freepik</li>
        </ul>
      </section>

      <!-- Back to top -->
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
        <router-link to="/cookies" class="footer-link">
          <img src="@/assets/img/icons/cookie.png" alt="">
          Politique Cookies
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