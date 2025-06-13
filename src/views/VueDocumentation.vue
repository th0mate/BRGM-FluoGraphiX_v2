<script setup lang="ts">
import {afficherPopup} from "@/assets/js/UI/popupService.ts";
import errorImage from '@/assets/img/popup/error.png';

const imageHTML = `<img src="${errorImage}" alt="Erreur" style="width: 120px;">`;
afficherPopup(
    imageHTML,
    'Erreur',
    'Page non implémentée',
    `Cette page n'est pas encore développée. Si le problème persiste, n'hésitez pas à ouvrir une issue sur le dépôt Github.`,
    'Fermer'
);
</script>

<template>
</template>

<style scoped>

</style>

