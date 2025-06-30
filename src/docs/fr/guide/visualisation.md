# Visualisation

La page "Visualisation" vous permet de consulter vos données de mesure sur un graphique interactif. Vous pouvez zoomer, dézoomer et naviguer dans le temps pour explorer vos données de manière intuitive.
Il est également possible de corriger, de convertir et d'exporter vos données de mesure en utilisant les outils mis à disposition dans cette section.

---

## Import de fichiers
Pour commencer, cliquez sur le bouton "Commencer" dans la section "Visualisation". Vous pourrez alors sélectionner un ou plusieurs fichiers depuis votre appareil.
Notez que vous pouvez importer plusieurs fichiers de mesure en même temps, ce qui vous permet de visualiser des données sur une large période de mesure. 
Pour effectuer les différentes opérations de correction, de conversion et d'export, vous devez également importer un fichier de calibration.

::: warning
**⚠️ Important :**
Les formats acceptés sont CSV, DAT, XML et MV pour les données de mesure, et DAT et CSV pour les fichiers de calibration. Assurez-vous que vos fichiers sont correctement formatés pour éviter les erreurs lors de l'import.
:::

Une fois vos fichiers importés, vous pouvez les visualiser sur le graphique interactif.

<img src="/src/assets/img/doc/visualisation1.png" alt="Interface FluoGraphiX" style="width: 100%; max-width: 600px; display: block; margin: 20px auto;">

::: info
**💡 Astuce :**
Vous pouvez importer un fichier de calibration après avoir importé vos données de mesure dans l'utilitaire de calculs et d'export.
:::

---

## Fonctionnalités avancées
Plusieurs fonctionnalités avancées sont disponibles lors de l'import de fichiers dans la partie "Visualisation" de FluoGraphiX :

<details>
  <summary>Format de date</summary>
  <p>Le format de date par défaut est jj/mm/aaaa. Si vous importez un fichier de calibration au format DAT, le format sera automatiquement appliqué. Vous pouvez définir vous-même le format de date dans la liste déroulante dédiée avant d'importer vos fichiers. </p>
</details>

<details>
  <summary>Outil de détections d'anomalies</summary>
  <p>Si des données potentiellement incorrectes sont détectées dans votre fichier de calibration, un encadré vous avertira de la situation dans l'utilitaire de calculs et d'export.</p>
</details>

<details>
  <summary>Outil de renommage de courbes</summary>
  <p>Si les données de calibration ne correspondent pas aux données de mesure importées, l'utilitaire de calculs et d'export vous proposera de les renommer pour les faire correspondre.</p>
</details>

<details>
  <summary>Rejet automatique lors d'un trop grand écart</summary>
  <p>Si plusieurs fichiers de mesure ont été importés, et qu'un écart trop important est détecté entre deux d'entre eux, l'import sera automatiquement annulé, pour éviter l'affichage d'un graphique tronqué. </p>
</details>

---

## Graphique interactif
Le graphique interactif vous permet de visualiser vos données de mesure de manière intuitive. Vous pouvez :
* Zoomer et dézoomer pour explorer vos données en détail.
* Naviguer dans le temps pour voir l'évolution de vos mesures.
* Afficher ou masquer les courbes de mesure et de calibration selon vos besoins.

<img src="/src/assets/img/doc/visualisation2.png" alt="Interface FluoGraphiX" style="width: 100%; max-width: 600px; display: block; margin: 20px auto;">

---

## Utilitaire de calculs et d'export
L'utilitaire de calculs et d'export vous permet de corriger vos données de mesure, de les convertir en concentrations réelles et de les exporter dans différents formats.
Pour accéder à cet utilitaire, vous devez d'abord importer au moins un fichier de mesure et un fichier de calibration. Une fois ces fichiers importés, vous pouvez :
* Corriger vos données de mesure en appliquant des corrections de turbidité et de bruit de fond.
* Convertir vos traceurs en concentrations.
* Exporter vos données de mesure en un seul fichier CSV ou TRAC.
* Supprimer des courbes de mesure si nécessaire.

<img src="/src/assets/img/doc/visualisation3.png" alt="Interface FluoGraphiX" style="width: 100%; max-width: 300px; display: block; margin: 20px auto;">

::: warning
**⚠️ Important :**
Si l'écran de votre appareil n'est pas assez large, l'utilitaire de calculs et d'export ne sera pas affiché.
:::

---

## Export
FluoGraphiX vous permet d'exporter vos données de mesure en un seul fichier CSV, également disponible au format TRAC après la conversion d'au moins un traceur.
L'export se fait dans l'utilitaire de calculs et d'export, après avoir importé au moins un fichier de mesure et un fichier de calibration.

Lors de l'export au format CSV, vous pouvez également choisir d'exporter les détails des calculs effectués. Cette option n'est disponible que si vous avez effectué au moins un calcul de correction ou de conversion.

::: info
**💡 Astuce :**
Ces fichiers peuvent eux-mêmes être importés dans FluoGraphiX dans la partie "Visualisation".
:::

::: warning
**⚠️ Important :**
L'export au format TRAC n'est pas disponible si vous n'avez pas converti au moins un traceur en concentration.
:::

<img src="/src/assets/img/doc/visualisation4.png" alt="Interface FluoGraphiX" style="width: 100%; max-width: 250px; display: block; margin: 20px auto;">

---

## Correction de turbidité
Vous pouvez corriger l'incidence de la turbidité sur vos courbes en vous rendant dans l'onglet dédié de l'utilitaire de calculs et d'export.

Pour ce faire, vous devez sélectionner le niveau de correction souhaité, puis sélectionner les lampes à corriger, et enfin cliquer sur le bouton "Calculer". FluoGraphiX appliquera alors la correction de turbidité à vos données de mesure.

De nouvelles courbes seront créées, avec le suffixe "_corr" ajouté à leur nom. Vous pouvez alors les consulter dans le graphique interactif.

<img src="/src/assets/img/doc/visualisation5.png" alt="Interface FluoGraphiX" style="width: 100%; max-width: 250px; display: block; margin: 20px auto;">

---

## Correction des interférences

Vous pouvez corriger les interférences générées par un ou deux traceurs sur vos courbes en vous rendant dans l'onglet dédié de l'utilitaire de calculs et d'export.

Sélectionnez le nombre de traceurs à choisir, puis sélectionnez vos traceurs.

Cliquez sur "terminer" pour afficher dans votre graphique la/les courbe(s) corrigée(s).

<img src="/src/assets/img/doc/visualisation6.png" alt="Interface FluoGraphiX" style="width: 100%; max-width: 250px; display: block; margin: 20px auto;">

---

## Correction du bruit de fond

::: warning
**⚠️ Important :**
Cette correction n'est disponible que si vous avez effectué une correction d'interférences au préalable.
:::

Vous pouvez également corriger le bruit de fond sur l'une de vos courbes, représentant un traceur.

Pour accéder à cette option, vous devez avoir corrigé les interférences d'un ou deux traceurs.

Vous pouvez sélectionner la période du graphique influencée par le traceur.

::: warning
**⚠️ Important :**
Cette étape est facultative et doit être faite en premier lieu.
:::

Sélectionnez ensuite les variables explicatives (courbes) à utiliser pour le calcul (2 courbes sélectionnées minimum, 3 maximum). Les courbes sélectionnées par défaut sont celles ayant été corrigées ("Corr").

Cliquez sur "calculer" pour afficher la nouvelle courbe calculée ("LxCorr") sur le graphique.

<img src="/src/assets/img/doc/visualisation7.png" alt="Interface FluoGraphiX" style="width: 100%; max-width: 250px; display: block; margin: 20px auto;">

---

## Converion en concentration

Vous pouvez convertir vos traceurs en concentrations en vous rendant dans l'onglet "Convertir en concentration".

Les traceurs sont récupérés à partir du fichier de calibration. Chaque traceur est associé à une courbe, en fonction de sa lampe principale.

Vous pouvez sélectionner un traceur à convertir puis cliquer sur "terminer". La courbe représentant alors votre traceur en concentration apparaît.

::: info
**💡 Astuce :**
Vous pouvez ensuite exporter ces données pour le logiciel TRAC
:::

<img src="/src/assets/img/doc/visualisation8.png" alt="Interface FluoGraphiX" style="width: 100%; max-width: 600px; display: block; margin: 20px auto;">
