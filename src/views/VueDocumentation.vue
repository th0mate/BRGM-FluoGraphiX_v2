<script setup lang="ts">
import Toast from 'primevue/toast'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast';
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
  try {
    const imgModule = await import('@/assets/img/popup/warning.png');
    popupService.showPopup({
      imageUrl: imgModule.default,
      headerTitle: 'Avertissement',
      title: 'Données potentiellement incohérentes détectées',
      content: 'Les données calculées indiquent une potentielle erreur dans les données de calibration importées. Assurez-vous qu\'elles soient correctes.',
      buttonText: 'Fermer'
    });
  } catch (error) {
    console.error('Erreur lors du chargement de l\'image:', error);
  }
};
</script>

<template>
  <!-- Composant Toast (doit être inclus dans le template) -->
  <Toast position="bottom-right" />

  <div class="card">
    <h2>Démonstration des Toasts PrimeVue</h2>
    <div class="grid">
      <div class="col-12 md:col-6 lg:col-3">
        <div class="p-inputgroup">
          <Button label="Toast Succès" icon="pi pi-check" class="p-button-success w-full" @click="showSuccessToast" />
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <div class="p-inputgroup">
          <Button label="Toast Erreur" icon="pi pi-times" class="p-button-danger w-full" @click="showErrorToast" />
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <div class="p-inputgroup">
          <Button label="Toast Avertissement" icon="pi pi-exclamation-triangle" class="p-button-warning w-full" @click="showWarningToast" />
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <div class="p-inputgroup">
          <Button label="Toast Info" icon="pi pi-info-circle" class="p-button-info w-full" @click="showInfoToast" />
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <div class="p-inputgroup">
          <Button label="Position personnalisée" icon="pi pi-map-marker" class="p-button-help w-full" @click="showCustomPositionToast" />
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <div class="p-inputgroup">
          <Button label="Toast persistant" icon="pi pi-pin" class="p-button-secondary w-full" @click="showStickyToast" />
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <div class="p-inputgroup">
          <Button label="Popup personnalisé" icon="pi pi-clock" class="p-button-text w-full" @click="afficherPopupTest" />
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
.layer {
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;

  .popup {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    background: #fff;
    border-radius: 15px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    width: 420px;
    height: fit-content;
    overflow: hidden;
    color: var(--grisBRGM);
    user-select: none;

    .header {
      width: 100%;
      background: #FFDBBB;
      font-size: 0.8em;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 15px;

      img {
        width: 25px;
        height: 25px;
        cursor: pointer;
        padding: 5px;
        border-radius: 15px;
        transition: all 0.3s ease;
        background: #ffffff;

        &:hover {
          background: var(--grisFin);
        }
      }
    }

    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 25px;
      padding: 10px 20px 30px 20px;
      width: 100%;
      height: 100%;
      text-align: center;

      img {
        width: 120px;
      }

      h2 {
        font-size: 1.2em;
        margin: 0;
      }

      .texte-gris-simple {
        font-size: 1em;
      }

      .bouton {
        background: var(--orangeBRGM);
        color: white;
        padding: 10px 20px;
        border-radius: 30px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        border: 2px solid transparent;

        &:hover {
          background: transparent;
          color: var(--grisBRGM);
          border-color: var(--grisBRGM);
        }
      }
    }
  }
}
</style>

