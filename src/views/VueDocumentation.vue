<template>
  <div class="bannierePage">
    <img src="@/assets/img/hydro_pictures/img12.jpg" alt="Sources">
    <div class="contenu">
      <h2>Documentation de <span class="orange">FluoGraphiX</span></h2>
      <p><span @click="router.push('accueil')"><span></span>Accueil</span> <strong> / Documentation</strong></p>
      <span class="auteur"><img src="@/assets/img/icons/auteur.png" class="info" alt=""> <h3>© AdobeStock - jerry, Arizona, Etats-Unis, 2017.</h3></span>
    </div>
  </div>

  <div class="mobile-header" :style="{ '--banner-height': bannerHeight }">
    <span class="interaction-responsive" @click="isLeftSidebarOpen = true">
      <img src="@/assets/img/icons/menu.png" alt="Menu">
      {{ $t('documentation.menu') }}
    </span>
    <span class="interaction-responsive" @click="isRightSidebarOpen = true">
      {{ $t('documentation.onThisPage') }}
      <img src="@/assets/img/icons/docte.png" alt="Menu">
    </span>
  </div>

  <DocumentationLayout class="iframe" :headings="currentHeadings" :activeHeadingId="activeHeadingId" :style="{ '--banner-height': bannerHeight }" :isLeftSidebarOpen="isLeftSidebarOpen" :isRightSidebarOpen="isRightSidebarOpen" @close-sidebars="closeSidebars">
    <router-view @update:headings="handleHeadingsUpdate" @update:active-heading-id="handleActiveHeadingUpdate"></router-view>
  </DocumentationLayout>
</template>

<script setup lang="ts">
import router from "@/router";
import DocumentationLayout from "@/components/documentation/DocumentationLayout.vue";
import { ref, onMounted } from 'vue';

const currentHeadings = ref<{ id: string; text: string; level: number }[]>([]);
const activeHeadingId = ref<string | null>(null);
const bannerHeight = ref('0px');

const isLeftSidebarOpen = ref(false);
const isRightSidebarOpen = ref(false);

const closeSidebars = () => {
  isLeftSidebarOpen.value = false;
  isRightSidebarOpen.value = false;
};

const handleHeadingsUpdate = (headings: { id: string; text: string; level: number }[]) => {
  currentHeadings.value = headings;
};

const handleActiveHeadingUpdate = (id: string | null) => {
  activeHeadingId.value = id;
};

onMounted(() => {
  const banner = document.querySelector('.bannierePage');
  if (banner) {
    bannerHeight.value = `${banner.offsetHeight}px`;
  }
});
</script>

<style>
@import "@/assets/styles/documentation.css";
</style>

