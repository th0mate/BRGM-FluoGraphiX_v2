<script setup lang="ts">
import Carousel from '@/components/Visualisation/Carousel.vue';
import {reactive} from "vue";
import { AffichageVisualisation } from "@/assets/js/Visualisation/AffichageVisualisation"

const affichageVisualisation = reactive(new AffichageVisualisation());
</script>

<template>
<Carousel :affichageVisualisation="affichageVisualisation" />
</template>

<style scoped>

</style>

