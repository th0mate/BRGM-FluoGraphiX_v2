<template>
  <div class="language-switcher">
    <button class="flag-button" @click="toggleLanguage" aria-label="Changer de langue">
      <img
        :src="currentLocale === 'fr' ? flagFR : flagEN"
        :alt="currentLocale === 'fr' ? 'Drapeau français' : 'Drapeau anglais'"
        width="24"
        height="24"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import flagFR from '@/assets/img/icons/francais.png';
import flagEN from '@/assets/img/icons/anglais.png';

const { locale } = useI18n();
const currentLocale = computed(() => locale.value);

const toggleLanguage = () => {
  const newLocale = currentLocale.value === 'fr' ? 'en' : 'fr';
  locale.value = newLocale;
  localStorage.setItem('locale', newLocale);
};
</script>

<style scoped>
.language-switcher {
  margin-left: 1rem;
}

.flag-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flag-button:hover {
  transform: scale(1.1);
}
</style>
