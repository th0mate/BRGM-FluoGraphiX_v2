<script setup lang="ts">
import router from "@/router";
</script>

<template>
  <div class="bannierePage">
    <img src="@/assets/img/hydro_pictures/img10.jpg" alt="Sources">
    <div class="contenu">
      <p><span @click="router.push('accueil')"><span></span>Accueil</span> <strong> / Mentions légales</strong></p>
      <h2>Mentions <span class="orange">Légales</span></h2>
      <span class="auteur"><img src="@/assets/img/icons/auteur.png" class="info" alt=""> <h3>© Joe Cornish/Digital Vision/Getty Images, Utah, Etats-Unis.</h3></span>
    </div>
  </div>

  <div class="cookies">
    <h2>En utilisant ce site internet, vous acceptez les conditions générales d'utilisation énoncées ci-après. Le BRGM
      se réserve le droit de modifier les présentes dispositions à tout moment et sans avis préalable.</h2>
    <br>

    <h1 class="titreBarre">Éditeur du <span class="orange">site</span></h1>
    <p>Ce site internet est édité par le BRGM (Bureau de Recherches Géologiques et Minières). Le BRGM est un
      établissement public à caractère industriel et commercial (EPIC).</p>
    <h3>Équipe en charge du site</h3>
    <h4>Directeur de la publication</h4>
    <p>Pierre Vassal, responsable de la Communication, de la Médiation scientifique et des Éditions du BRGM</p>

    <h4>Responsable éditoriale</h4>
    <p>Aude Rouger-Loiseau, chargée de la communication digitale, service de la Communication de la Médiation
      scientifique et des Éditions</p>

    <h4>Webmaster technique</h4>
    <p>Fabrice Catonet, responsable de l'unité Équipements et services aux utilisateurs, secrétariat général, service
      Systèmes d'information</p>

    <h3>Coordonnées</h3>
    <ul>
      <li>BRGM</li>
      <li>3 avenue Claude-Guillemin, BP 36009</li>
      <li>45060 Orléans Cedex 02</li>
      <li>France</li>
      <li>Tél: + 33 (0)2 38 64 34 34</li>
    </ul>
    <br>


    <h3>Renseignements administratifs</h3>
    <ul>
      <li>Code APE (NAF) : 7219Z</li>
      <li>Numéro SIREN : 582 056 149</li>
      <li>Numéro SIRET (siège) : 58205614900120</li>
      <li>Numéro RCS : RCS Orléans 582 056 149</li>
      <li>TVA intracommunautaire : FR67582056149</li>
    </ul>
    <br>


    <h1 class="titreBarre">Crédits du <span class="orange">développement</span></h1>
    <h3>Conception, création et développement du site</h3>
    <ul>
      <li>Thomas LOYE</li>
      <li>Étudiant en Informatique à l'IUT Montpellier - Sète</li>
    </ul>
    <div class="multiple">
      <a class="bouton boutonFonce" target="_blank" href="https://thomasloye.fr">Site Internet</a>
      <a class="bouton boutonClair" target="_blank" href="www.linkedin.com/in/thomas-loye-b9a615264">Linkedin</a>
    </div>


    <h3>Hébergement</h3>
    <ul>
      <li>BRGM</li>
      <li>Direction des Infrastructures et des Services Numériques</li>
      <li>3 avenue Claude-Guillemin, BP 36009</li>
      <li>45060 Orléans Cedex 02</li>
      <li>France</li>
    </ul>


    <h1 class="titreBarre">Droit <span class="orange">applicable</span></h1>
    <p>Le site est régi par la loi française. Les utilisateurs étrangers acceptent formellement l'application de la loi
      française en visitant ce site et en utilisant tout ou partie des fonctionnalités du site.</p>


    <h1 class="titreBarre">Utilisation du <span class="orange">site</span></h1>
    <ul>
      <li>L'utilisation du site est reservée à un usage personnel.</li>
      <li>Le site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet.</li>
      <li>Le BRGM se réserve le droit de modifier, à tout moment et sans préavis, le contenu du site.</li>
      <li>L'accès au site peut être interrompu à tout moment, sans préavis, notamment en cas de force majeure, de
        maintenance ou si le BRGM décide de suspendre ou d'arrêter la fourniture de ce service.
      </li>
      <li>Le BRGM ne saurait être tenu pour responsable de quelconques dommages dus à des dysfonctionnements du site
        internet.
      </li>
    </ul>

    <h1 class="titreBarre">Contenu du <span class="orange">site</span></h1>
    <p>Le BRGM s'efforce d'assurer, au mieux de ses possibilités, l'exactitude et la mise à jour des informations
      diffusées, au moment de leur mise en ligne sur le site. Cependant, le BRGM ne garantit en aucune façon
      l'exactitude, la précision ou l'exhaustivité des informations mises à disposition. Les informations présentes sur
      le site sont non-contractuelles et peuvent être modifiées à tout moment.</p>
  </div>
</template>

<style scoped>
@import "@/assets/styles/cookies.css";
</style>