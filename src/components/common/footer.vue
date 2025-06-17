<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <footer>
    <img class="logo" src="@/assets/img/cosmetics/banniereSmall.svg" alt="BRGM Logo">
    <div class="wrap-cards">
      <div class="card">
        <span class="color"></span>
        <span>{{ t('footer.cookieManagement') }}</span>
        <RouterLink to="/documentation" class="animated-link">{{ t('footer.seeMore') }} <img src="@/assets/img/icons/fleche-droite.png" alt=""></RouterLink>
      </div>

      <div class="card">
        <span class="color"></span>
        <span>{{ t('footer.legalNotices') }}</span>
        <RouterLink to="/documentation" class="animated-link">{{ t('footer.seeMore') }} <img src="@/assets/img/icons/fleche-droite.png" alt=""></RouterLink>
      </div>

      <div class="card">
        <span class="color"></span>
        <span>{{ t('footer.contentSources') }}</span>
        <RouterLink to="/documentation" class="animated-link">{{ t('footer.seeMore') }} <img src="@/assets/img/icons/fleche-droite.png" alt=""></RouterLink>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  background-image: url('@/assets/img/hydro_pictures/img1.jpg');
}
</style>