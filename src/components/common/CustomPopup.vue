<template>
  <Teleport to="body">
    <div v-if="modelValue" class="layer">
      <div class="popup">
        <div class="header">
          <span>{{ headerTitle }}</span>
          <img
            :src="closeIcon"
            alt="Fermer"
            @click="closePopup"
            class="close-icon"
          />
        </div>

        <div class="content">
          <div v-if="imageUrl" class="image-container">
            <img :src="imageUrl" :alt="headerTitle" />
          </div>
          <div v-else-if="imageHtml" v-html="imageHtml" class="image-container"></div>

          <h2 v-if="title">{{ title }}</h2>
          <span v-if="content" class="texte-gris-simple">{{ content }}</span>
          <span v-if="buttonText" class="bouton" @click="closePopup">{{ buttonText }}</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import closeIcon from '@/assets/img/popup/close.png';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  headerTitle: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  buttonText: {
    type: String,
    default: 'Fermer'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  imageHtml: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'close']);

const closePopup = () => {
  emit('update:modelValue', false);
  emit('close');
};

watch(() => props.modelValue, (newValue) => {
  document.body.style.overflowY = newValue ? 'hidden' : 'auto';
}, { immediate: true });
</script>

<style scoped>

</style>
