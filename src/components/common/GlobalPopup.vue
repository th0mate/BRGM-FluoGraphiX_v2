<template>
  <PopupDialog
    v-model:visible="popupState.visible"
    :titre="popupState.titre"
    :contenu="popupState.contenu"
    :icon="popupState.icon"
    :boutons="popupState.boutons"
    :width="popupState.width"
    @boutonClick="onBoutonClick"
  />
</template>

<script setup>
import { onMounted } from 'vue';
import PopupDialog from '@/components/common/PopupDialog.vue';
import { getPopupState } from '@/assets/js/UI/popupsManagerPrime';

const popupState = getPopupState();

const onBoutonClick = (bouton) => {
  if (bouton.action) {
    bouton.action();
  }
};
</script>
