# 🌊 FluoGraphiX - V2

<p align="center">
  <img src="https://img.shields.io/badge/status-en%20développement-blue.svg" />
  <img src="https://img.shields.io/badge/license-MIT-lightgrey.svg" />
</p>

<p align="center">
  <strong>Un outil de visualisation et de traitement des données fluorimétriques, conçu pour les campagnes de traçage en hydrogéologie.</strong><br/>
  Développé pour le compte du <a href="https://www.brgm.fr/" target="_blank">BRGM</a> — 2024-2025
</p>
<p align="center">
  ✅ Accéder à la page des statuts des tests automatisés via <a href="https://th0mate.github.io/BRGM-FluoGraphiX_v2/" target="_blank">Playwright</a>
</p>

---

## 🧠 À propos

**FluoGraphiX** est une application web et de bureau permettant aux hydrogéologues de **visualiser**, **calibrer** et **traiter** des données issues de **fluorimètres**, utilisées lors de **campagnes de traçage**.

Ce projet a été initié lors d’un stage de deuxième année de BUT Informatique (avril–juin 2024), puis poursuivi en développement open source. Deux versions sont en cours. Cette présente version est la seconde itération du projet, dite v2, apportant de nouvelles fonctionnalités dans une architecture retravaillée.

---

## ✨ Fonctionnalités principales

- 📁 Import de données fluorimétriques (CSV, XML, MV)
- 📊 Visualisation graphique via **ChartJS**
- 🧮 Calibration des données (CSV et DAT)
- 🔧 Outils de correction et conversion des mesures
- 🖥️ Interface utilisateur claire et épurée (UI/UX)
- 💾 Utilisable hors ligne après téléchargement d'un fichier exécutable
- 🔄 Mises à jour automatiques
- 🌐 Disponible en anglais et en français
- 🆕 Projet migré en Vue.js et Electron.js

<em>Pour en savoir plus sur la v1 : [Présentation de FluoGraphiX](https://thomasloye.fr/projets/fluographix)</em>


---
  
## 📸 Aperçu visuel  

> 📌 Exemples des interfaces de l'outil :  

<img src="https://thomasloye.fr/Data/fluographix_v2/1.png" />
<img src="https://thomasloye.fr/Data/fluographix_v2/2.png" />
<img src="https://thomasloye.fr/Data/fluographix_v2/3.png" />  


---

## 🔧 Technologies utilisées

| Catégorie                 | Technologies                                   |
|--------------------------|-------------------------------------------------|
| **Langages**             | JavaScript, HTML5, CSS3 via Vue.js              |
| **Librairies**           | ChartJS, Moment.js, PrimeVue, VueI18n, html2canvas, Electron.js|
| **Développement**        | GitHub, WebStorm, Playwright                    |
| **Design & gestion**     | Figma (UI/UX), Notion & Trello (gestion de projet)  |

---

## 📈 Phases de développement

> 🕒 **260+ heures de développement (v1) + 150 heures (v2)**  
> 👤 **Seul développeur**  
> 🧑‍🔬 En collaboration avec les hydrogéologues du BRGM

| Phase              | Description                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| **Phase 0**        | Essais avec ChartJS sur données lourdes                                     |
| **Phase 1**        | Implémentation de la navigation (routing basique)                           |
| **Phase 2**        | Création des pages satellites (import, export, aide)                        |
| **Phase 3**        | Affichage des mesures en graphique                                          |
| **Phase 4**        | Affichage/calcul des données de calibration                                 |
| **Phase 5**        | Ajout de traitements correctifs et conversions                              |
| **Phase 6**        | Refonte graphique complète (UI/UX sur Figma)                                |
| **Phase 7** | Publication de la v1 de l'outil                                         |
| **Phase 8 (en cours)** | Travail sur la v2 : **VueJS + ElectronJS**     |
  

---

## 📦 Installation

> 💡 Vous pouvez télécharger l'exécutable de l'outil depuis le site de FluoGraphiX

---

## 📁 Structure du projet

```txt
fluographix/
├── .github/           # Workflow Github automatisé pour les tests Playwright
├── public/           # Les éléments de build du projet (favicon, htaccess)
├── src/
│   ├──  assets/
│   │   ├── js/
│   │   │   ├── Calibration/           # Mécanique de gestion de la partie "calibration"
│   │   │   ├── Common/           # Fonction utilitaires communes à toutes les classes
│   │   │   ├── Graphiques/           # Classes permettant l'affichage et la gestion des graphiques
│   │   │   ├── LecteursDocuments/           # Classes permettant la lecture et la conversion des documents importés
│   │   │   ├── Objects/           # Objets permettant la gestion des Traceurs et des Calculs
│   │   │   ├── Session/           # Objet permettant le stockage des informations du site
│   │   │   ├── UI/           # Gestion des mécaniques visuelles du site
│   │   ├── img/           # Icônes et illustrations
│   │   ├── styles/           # Fichiers css
│   │   ├── img/           # Icônes et illustrations
│   ├──  components/           # Composants Vue (carousel, footer, navbar...)
│   ├──  locales/           # Stockage des textes en français & en anglais
│   ├──  router/           # Gestion des routes du site
│   ├──  views/           # Interfaces Vue des pages
│   ├── App.vue             # Fichier principal Vue du projet
│   └── main.ts             # Fichier de configuration de Vue
├── tests/
│   ├──  fixtures/             # Fichiers d'import et de comparaison pour les tests Playwright
│   ├──  types/             # Types TypeScript pour les tests Playwright
│   ├──  utils/             # Fonctions utilitaires pour les tests Playwright
│   ├──  calculs-visualisation.spec.ts             # Tests sur les calculs et l'export depuis la partie "visualisation"
│   ├──  calibration.spec.ts             # Tests sur la partie "calibration"
│   ├──  imports-visualisation.spec.ts             # Tests sur les imports de la partie "visualisation"
├── env.d.ts           # Les types globaux Typescript du projet
├── index.html           # Point d'entrée du projet
├── main.js           # Fichier de configuration Electron.js
├── package.json           # Fichier de configuration Node
├── playwright.config.ts           # Fichier de configuration Playwright
├── preload.js           # Fichier de configuration pré-build Electron.js
└── ...
```

---

## 🧰 Outils utilisés

- 🧑‍💻 IDE : **WebStorm**
- 📘 Gestion de projet : **Notion, Trello**
- 🔍 UI/UX design : **Figma**
- 🔁 Versionning : **Git & GitHub**

---

## 🤝 Contribuer

- ⭐ Star le projet pour suivre son évolution
- 📬 Ouvrir une *issue* pour signaler un bug ou proposer une idée

---

## 📜 Licence

Le projet sera bientôt publié sous la licence **MIT**.

---

## 👤 Auteur

Développé par **Thomas LOYE**  
📍 Stage réalisé au [**BRGM**](https://www.brgm.fr), d’avril à juin 2024  
✉️ Contact : [thomasloye1@gmail.com](mailto:thomasloye1@gmail.com)  
🖥️ Site web [thomasloye.fr](https://thomasloye.fr)

---

<p align="center">
  ✨ Merci pour votre intérêt pour FluoGraphiX ✨ <br/>
  <em>Un outil libre, pensé pour les scientifiques du terrain.</em>
</p>
