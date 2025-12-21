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
        <h1 class="legal-hero-title">Mentions <span class="accent">Légales</span></h1>
        <p class="legal-hero-description">
          En utilisant ce site internet, vous acceptez les conditions générales d'utilisation énoncées ci-après.
          Le BRGM se réserve le droit de modifier les présentes dispositions à tout moment et sans avis préalable.
        </p>
      </div>
    </section>

    <section class="legal-articles-grid">
      <article class="legal-article-card" @click="scrollToSection('article-1')">
        <img src="@/assets/img/icons/code.png" alt="" class="card-icon">
        <div class="card-content">
          <h3 class="card-title">Art. 1 – Éditeur du <span class="accent">Site</span></h3>
          <p class="card-description">
            BRGM, établissement public à caractère industriel et commercial (EPIC).
          </p>
        </div>
      </article>

      <article class="legal-article-card" @click="scrollToSection('article-2')">
        <img src="@/assets/img/icons/code.png" alt="" class="card-icon">
        <div class="card-content">
          <h3 class="card-title">Art. 2 – Crédits du <span class="accent">Développement</span></h3>
          <p class="card-description">
            Conception, développement et hébergement du site.
          </p>
        </div>
      </article>

      <article class="legal-article-card" @click="scrollToSection('article-3')">
        <img src="@/assets/img/icons/auction.png" alt="" class="card-icon">
        <div class="card-content">
          <h3 class="card-title">Art. 3 – Droit <span class="accent">Applicable</span></h3>
          <p class="card-description">
            Le site est régi par la loi française.
          </p>
        </div>
      </article>

      <article class="legal-article-card" @click="scrollToSection('article-4')">
        <img src="@/assets/img/icons/website.png" alt="" class="card-icon">
        <div class="card-content">
          <h3 class="card-title">Art. 4 – Utilisation du <span class="accent">Site</span></h3>
          <p class="card-description">
            Conditions d'accès et réserves de responsabilité.
          </p>
        </div>
      </article>

      <article class="legal-article-card" @click="scrollToSection('article-5')">
        <img src="@/assets/img/icons/align-left.png" alt="" class="card-icon">
        <div class="card-content">
          <h3 class="card-title">Art. 5 – Contenu du <span class="accent">Site</span></h3>
          <p class="card-description">
            Exactitude et mise à jour des informations.
          </p>
        </div>
      </article>
    </section>

    <main class="legal-content">
      <section id="article-1" class="legal-section">
        <h2 class="section-title">Article 1 : Éditeur du <span class="accent">Site</span></h2>
        <p class="section-text">
          Ce site internet est édité par le BRGM (Bureau de Recherches Géologiques et Minières). Le BRGM est un
          établissement public à caractère industriel et commercial (EPIC), placé sous la tutelle du ministère
          de l'Enseignement supérieur, de la Recherche et de l'Innovation et du ministère de la Transition
          écologique et solidaire.
        </p>

        <h3 class="section-subtitle">Équipe en charge du site</h3>

        <p class="section-highlight"><span class="underline">Directeur de la publication</span> :</p>
        <p class="section-text">
          Pierre Vassal, responsable de la Communication, de la Médiation scientifique et des Éditions du BRGM
        </p>

        <p class="section-highlight"><span class="underline">Responsable éditoriale</span> :</p>
        <p class="section-text">
          Aude Rouger-Loiseau, chargée de la communication digitale, service de la Communication de la Médiation
          scientifique et des Éditions
        </p>

        <p class="section-highlight"><span class="underline">Webmaster technique</span> :</p>
        <p class="section-text">
          Fabrice Catonet, responsable de l'unité Équipements et services aux utilisateurs, secrétariat général,
          service Systèmes d'information
        </p>

        <h3 class="section-subtitle">Coordonnées</h3>
        <ul class="section-list">
          <li>BRGM</li>
          <li>3 avenue Claude-Guillemin, BP 36009</li>
          <li>45060 Orléans Cedex 02</li>
          <li>France</li>
          <li>Tél: + 33 (0)2 38 64 34 34</li>
        </ul>

        <h3 class="section-subtitle">Renseignements administratifs</h3>
        <ul class="section-list">
          <li>Code APE (NAF) : 7219Z</li>
          <li>Numéro SIREN : 582 056 149</li>
          <li>Numéro SIRET (siège) : 58205614900120</li>
          <li>Numéro RCS : RCS Orléans 582 056 149</li>
          <li>TVA intracommunautaire : FR67582056149</li>
        </ul>
      </section>

      <section id="article-2" class="legal-section">
        <h2 class="section-title">Article 2 : Crédits du <span class="accent">Développement</span></h2>

        <h3 class="section-subtitle">Conception, création et développement du site</h3>
        <ul class="section-list">
          <li>Thomas LOYE</li>
          <li>Étudiant en Informatique à l'IUT Montpellier - Sète et Montpellier Ynov Campus</li>
        </ul>
        <div class="section-buttons">
          <a class="btn-primary" target="_blank" href="https://thomasloye.fr">Site Internet</a>
          <a class="btn-secondary" target="_blank" href="https://www.linkedin.com/in/thomas-loye-b9a615264">LinkedIn</a>
        </div>

        <h3 class="section-subtitle">Hébergement</h3>
        <ul class="section-list">
          <li>BRGM</li>
          <li>Direction des Infrastructures et des Services Numériques</li>
          <li>3 avenue Claude-Guillemin, BP 36009</li>
          <li>45060 Orléans Cedex 02</li>
          <li>France</li>
        </ul>
      </section>

      <section id="article-3" class="legal-section">
        <h2 class="section-title">Article 3 : Droit <span class="accent">Applicable</span></h2>
        <p class="section-text">
          Le site est régi par la loi française. Les utilisateurs étrangers acceptent formellement l'application
          de la loi française en visitant ce site et en utilisant tout ou partie des fonctionnalités du site.
          Tout litige relatif à l'utilisation du site sera soumis à la compétence exclusive des tribunaux
          français.
        </p>
      </section>

      <section id="article-4" class="legal-section">
        <h2 class="section-title">Article 4 : Utilisation du <span class="accent">Site</span></h2>
        <ul class="section-list">
          <li>L'utilisation du site est réservée à un usage personnel.</li>
          <li>Le site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet.</li>
          <li>Le BRGM se réserve le droit de modifier, à tout moment et sans préavis, le contenu du site.</li>
          <li>L'accès au site peut être interrompu à tout moment, sans préavis, notamment en cas de force majeure,
            de maintenance ou si le BRGM décide de suspendre ou d'arrêter la fourniture de ce service.</li>
          <li>Le BRGM ne saurait être tenu pour responsable de quelconques dommages dus à des dysfonctionnements
            du site internet.</li>
        </ul>
      </section>

      <section id="article-5" class="legal-section">
        <h2 class="section-title">Article 5 : Contenu du <span class="accent">Site</span></h2>
        <p class="section-text">
          Le BRGM s'efforce d'assurer, au mieux de ses possibilités, l'exactitude et la mise à jour des
          informations diffusées, au moment de leur mise en ligne sur le site. Cependant, le BRGM ne garantit
          en aucune façon l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.
          Les informations présentes sur le site sont non-contractuelles et peuvent être modifiées à tout moment.
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
        <router-link to="/cookies" class="footer-link">
          <img src="@/assets/img/icons/cookie.png" alt=""> Politique Cookies
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