<script setup lang="ts">
import Toast from 'primevue/toast'
import Button from 'primevue/button'
import {useToast} from 'primevue/usetoast';
import popupService from '@/assets/js/UI/popupService';

const toast = useToast();
const test = false;

// Fonctions pour afficher différents types de toasts avec des styles améliorés
const showSuccessToast = () => {
  toast.add({
    severity: 'success',
    summary: 'Succès',
    detail: 'Opération réussie avec succès !',
    life: 3000,
    closable: true
  });
};

const showErrorToast = () => {
  toast.add({
    severity: 'error',
    summary: 'Erreur',
    detail: 'Une erreur est survenue lors de l\'opération',
    life: 3000,
    closable: true
  });
};

const showWarningToast = () => {
  toast.add({
    severity: 'warn',
    summary: 'Attention',
    detail: 'Action potentiellement dangereuse',
    life: 3000,
    closable: true
  });
};

const showInfoToast = () => {
  toast.add({
    severity: 'info',
    summary: 'Information',
    detail: 'Voici une information importante pour vous',
    life: 3000,
    closable: true
  });
};

// Toast avec position personnalisée
const showCustomPositionToast = () => {
  toast.add({
    severity: 'info',
    summary: 'Position personnalisée',
    detail: 'Ce toast s\'affiche en haut à droite',
    life: 3000,
    closable: true
  });
};

// Toast sans délai d'expiration (sticky)
const showStickyToast = () => {
  toast.add({
    severity: 'warn',
    summary: 'Toast persistant',
    detail: 'Ce message reste affiché jusqu\'à ce que vous le fermiez',
    closable: true
  });
};

const afficherPopupTest = async () => {
  const imgModule = await import('@/assets/img/popup/warning.png');
  popupService.showPopup({
    imageUrl: imgModule.default,
    headerTitle: 'Essai',
    title: 'Ce popup est un test du service de popup',
    content: 'Les popups permettent d\'afficher des informations importantes à l\'utilisateur.',
    buttonText: "J'ai compris",
  });
};
</script>

<template>
  <div class="card">
    <h2>Démonstration des Toasts PrimeVue</h2>
    <div class="grid">
      <div class="col-12 md:col-6 lg:col-3">
        <div class="p-inputgroup">
          <Button label="Toast Succès" icon="pi pi-check" class="p-button-success w-full" @click="showSuccessToast"/>
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <div class="p-inputgroup">
          <Button label="Toast Erreur" icon="pi pi-times" class="p-button-danger w-full" @click="showErrorToast"/>
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <div class="p-inputgroup">
          <Button label="Toast Avertissement" icon="pi pi-exclamation-triangle" class="p-button-warning w-full"
                  @click="showWarningToast"/>
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <div class="p-inputgroup">
          <Button label="Toast Info" icon="pi pi-info-circle" class="p-button-info w-full" @click="showInfoToast"/>
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <div class="p-inputgroup">
          <Button label="Position personnalisée" icon="pi pi-map-marker" class="p-button-help w-full"
                  @click="showCustomPositionToast"/>
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <div class="p-inputgroup">
          <Button label="Toast persistant" icon="pi pi-pin" class="p-button-secondary w-full" @click="showStickyToast"/>
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <div class="p-inputgroup">
          <Button label="Popup personnalisé" icon="pi pi-clock" class="p-button-text w-full"
                  @click="afficherPopupTest"/>
        </div>
      </div>
    </div>
  </div>


  <div class="layer" v-if="test">
    <div class="popup">
      <div class="header">
        <span>Avertissement</span>
        <img src="@/assets/img/popup/close.png" alt="">
      </div>

      <div class="content">
        <img src="@/assets/img/popup/warning.png" alt="">
        <h2>Données potentiellement incohérentes détectées</h2>
        <span class="texte-gris-simple">Les données calculées indiquent une potentielle erreur dans les données de calibration importées. Assurez-vous qu’elles soient correctes.</span>
        <span class="bouton">Fermer</span>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>

