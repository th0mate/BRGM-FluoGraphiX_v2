<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :closable="false"
    :style="{ width: width }"
    :showHeader="false"
    :dismissableMask="true"
    @hide="onHide"
    class="custom-popup">

    <div class="popup">
      <div class="entete">
        <div v-if="icon" class="popup-icon" v-html="icon"></div>
        <img
          src="@/assets/img/icons/close.png"
          alt="Fermer"
          class="close"
          @click="onClose"
        />
      </div>

      <h2 v-if="titre" class="popup-title">{{ titre }}</h2>
      <div v-if="contenu" class="popup-message">{{ contenu }}</div>

      <div v-if="$slots.footer" class="conteneurBoutons">
        <slot name="footer"></slot>
      </div>
      <div v-else-if="boutons && boutons.length" class="conteneurBoutons">
        <Button
          v-for="bouton in boutons"
          :key="bouton.texte"
          @click="handleBoutonClick(bouton)"
          :label="bouton.texte"
          :icon="bouton.icone"
          :class="['bouton', bouton.classe || '']"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  titre: {
    type: String,
    default: ''
  },
  contenu: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  boutons: {
    type: Array,
    default: () => []
  },
  width: {
    type: String,
    default: '30rem'
  }
});

const emit = defineEmits(['update:visible', 'close', 'boutonClick']);

// Utilisation de computed avec getters et setters pour une réactivité bidirectionnelle
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

const onClose = () => {
  emit('update:visible', false);
  emit('close');
};

const onHide = () => {
  emit('update:visible', false);
  emit('close');
};

const handleBoutonClick = (bouton) => {
  emit('boutonClick', bouton);
  if (bouton.action) {
    bouton.action();
  }
  if (bouton.fermerPopup !== false) {
    emit('update:visible', false);
  }
};
</script>

<style scoped>
/* Réinitialiser complètement les styles du Dialog PrimeVue */
.custom-popup :deep(.p-dialog) {
  box-shadow: none;
  border-radius: 0;
  max-height: 90%;
  width: 500px !important;
  margin: 0;
  transform: translate(-50%, -50%);
}

.custom-popup :deep(.p-dialog-mask.p-component-overlay) {
  z-index: 5;
}

.custom-popup :deep(.p-dialog-content) {
  border-radius: 0;
  padding: 0;
  background-color: var(--grisBRGM);
  color: white;
  border: 2px solid white;
  overflow: visible;
}

/* Styles pour la structure principale du popup */
.popup {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  align-content: center;
  min-height: 300px;
  padding: 10px;
  text-align: center;
  color: white;
}

/* Style pour l'en-tête et le bouton de fermeture */
.entete {
  width: 98%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  align-content: center;
}

.close {
  width: 25px;
  height: 25px;
  padding: 5px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;
}

.close:hover {
  background-color: var(--orangeBRGM);
}

/* Styles pour le contenu, titre et message */
.popup > .popup-icon {
  margin-bottom: 1rem;
}

.popup > img:not(.close, .loading) {
  width: 300px;
}

.loading {
  width: 150px;
}

.popup-title {
  color: var(--orangeBRGM);
  margin-top: 0;
  margin-bottom: 1rem;
}

.popup-message {
  margin-bottom: 1rem;
}

/* Style pour le conteneur des boutons */
.conteneurBoutons {
  width: 98%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  align-content: center;
  margin-top: auto;
}

/* Reset des styles des boutons PrimeVue */
.conteneurBoutons :deep(.p-button) {
  border-radius: 0;
  margin: 0;
  box-shadow: none;
}

/* Style pour le premier bouton */
.conteneurBoutons :deep(.p-button:nth-child(1)) {
  background-color: var(--orangeBRGM);
  border: 5px solid var(--orangeBRGM);
  min-width: 200px;
  color: white;
}

/* Style pour le deuxième bouton */
.conteneurBoutons :deep(.p-button:nth-child(2)) {
  background-color: transparent;
  border: 5px solid transparent;
  box-shadow: 0 0 0 1px white;
  min-width: 200px;
  color: white;
}

.conteneurBoutons :deep(.p-button:nth-child(2):hover) {
  box-shadow: 0 0 0 1px white, inset 0 0 0 1px white;
}

/* Style pour un bouton unique */
.conteneurBoutons :deep(.p-button:only-child) {
  background-color: var(--orangeBRGM);
  border: 5px solid var(--orangeBRGM);
  min-width: 200px;
  color: white;
}
</style>
