<script setup lang="ts">

</script>

<template>
  <div class="card anomalie">
    <img src="@/assets/img/popup/warning.png" alt="" class="icone">
    <span>Certaines de vos données de calibration sont susceptibles d'être incorrectes, veuillez les vérifier.</span>
  </div>
  <div class="actions card">
    <img v-tooltip.top="'Importer d\'autres fichiers'" class="action" src="@/assets/img/icons/importer.png"
         alt="Importer">
    <img v-tooltip.top="'Bloquer/libérer les interactions sur l\'axe x'" class="action"
         src="@/assets/img/icons/x_axis.png" alt="Importer">
    <img v-tooltip.top="'Bloquer/libérer les interactions sur l\'axe y'" class="action"
         src="@/assets/img/icons/y_axis.png" alt="Importer">
    <img v-tooltip.top="'Réinitialiser l\'affichage du graphique'" class="action"
         src="@/assets/img/icons/circulaire.png" alt="Importer">
    <img v-tooltip.top="'Prendre une capture d\'écran du graphique'" class="action"
         src="@/assets/img/icons/copier.png" alt="Importer">
  </div>
</template>

<style scoped>

</style>