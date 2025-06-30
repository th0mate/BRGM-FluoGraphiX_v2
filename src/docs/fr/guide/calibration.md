
# Calibration
La page "Calibration" vous permet de consulter vos données de calibration sur un graphique interactif et un tableau. Vous pouvez zoomer, dézoomer et naviguer dans le graphique pour explorer vos données de manière intuitive.
Vous pouvez ainsi vous assurer de la qualité de vos données de calibration avant de les utiliser pour corriger vos mesures, par exemple.

---

## Import de fichiers
Pour commencer, cliquez sur le bouton "Commencer" dans la section "Calibration". Vous pourrez alors sélectionner un fichier depuis votre appareil.

::: warning
**⚠️ Important :**
Les formats acceptés sont DAT et CSV pour les fichiers de calibration. Assurez-vous que votre fichier est correctement formaté pour éviter les erreurs lors de l'import.
:::

::: info
**💡 Astuce :**
Tout fluorimètre permettant d'avoir un signal brut peut être utilisé.
:::

Une fois vos fichiers importés, les données sont affichées sur la page pour votre premier traceur et sa lampe principale.

<img src="/img/doc/calibration2.png" alt="Interface FluoGraphiX" style="width: 100%; max-width: 600px; display: block; margin: 20px auto;">

---

## Fichier CSV de calibration
Le fichier CSV de calibration vous est proposé à l'export après l'import de votre fichier DAT de calibration. Il permet de centraliser vos données de calibration dans un fichier facile à lire et à manipuler. Vous pouvez ainsi corriger vos données de calibration très facilement, par exemple en utilisant un tableur.

::: info
**💡 Astuce :**
Ces fichiers de calibration au format CSV sont bien entendu importables dans FluoGraphiX pour une utilisation ultérieure.
:::


L'en-tête du fichier vous fournit les informations nécessaires importantes des mesures, comme la date de l'export ou encore le numéro de l'appareil de mesure associé.

::: warning
**⚠️ Important :**
Cette partie ne doit pas être modifiée, au risque de perturber le bon fonctionnement de l'outil lors de l'import du fichier.
:::

<img src="/img/doc/calibration1.png" alt="Interface FluoGraphiX" style="width: 100%; max-width: 600px; display: block; margin: 20px auto;">

D'autres informations sont également affichées, comme un résumé simple du fonctionnement de ce fichier.

::: warning
**⚠️ Important :**
Les fichiers de calibration CSV doivent toujours respecter le même ordre des traceurs, pour ne pas afficher des données corrompues par la suite.
L'eau doit toujours être disposée en première position dans le fichier, tandis que la turbidité doit toujours être placée en dernière position.
:::

Les autres traceurs doivent donc se trouver entre ces deux parties du fichier, sans ordre spécifique.

::: info
**💡 Astuce :**
Pour chaque traceur, vous pouvez ainsi retrouver son nom, sa date de mesure, son unité, et ses valeurs.
:::

---

## Affichage des données
Vos données de calibration sont affichées pour un traceur et une lampe donnée. Vous pouvez naviguer entre les traceurs et les lampes en utilisant les boutons situés en haut de la page.
Les données sont affichées sous forme de graphique interactif et de tableau, ce qui vous permet de visualiser facilement les valeurs.

Lorsque vous sélectionnez un traceur à afficher, la lampe principale associée est automatiquement sélectionnée. Vous pouvez cependant changer de lampe en choisissant une autre lampe dans la liste située en haut de la page.

<img src="/img/doc/calibration2.png" alt="Interface FluoGraphiX" style="width: 100%; max-width: 600px; display: block; margin: 20px auto;">