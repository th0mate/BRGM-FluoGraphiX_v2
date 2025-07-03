<template>
  <MarkdownRenderer
    v-if="markdownContent"
    :markdownContent="markdownContent"
    @update:headings="handleHeadingsUpdate"
    ref="markdownRendererRef"
  />
  <div v-else>Chargement de la documentation...</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import MarkdownRenderer from './MarkdownRenderer.vue';

const props = defineProps({
  section: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:headings', 'update:active-heading-id']);

const { locale } = useI18n();
const markdownContent = ref('');
const markdownRendererRef = ref<InstanceType<typeof MarkdownRenderer> | null>(null);
const observer = ref<IntersectionObserver | null>(null);
const activeHeadingId = ref<string | null>(null);

const loadMarkdown = async (lang: string, section: string, filename: string) => {
  try {
    const module = await import(`../../docs/${lang}/${section}/${filename}.md?raw`);
    markdownContent.value = module.default;
  } catch (error) {
    console.error(`Failed to load markdown for ${lang}/${section}/${filename}:`, error);
    markdownContent.value = `# Erreur: Page non trouvée\n\nLa page de documentation pour \`${section}/${filename}\` en \`${lang}\` n'a pas pu être chargée.`;
  }
};

const handleHeadingsUpdate = (headings: { id: string; text: string; level: number }[]) => {
  emit('update:headings', headings);
  nextTick(() => {
    setupIntersectionObserver();
  });
};

const setupIntersectionObserver = () => {
  if (observer.value) {
    observer.value.disconnect();
  }

  const headings = markdownRendererRef.value?.$el.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
  if (!headings || headings.length === 0) {
    return;
  }

  observer.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeHeadingId.value = entry.target.id;
        emit('update:active-heading-id', activeHeadingId.value);
      }
    });
  }, {
    rootMargin: '0px 0px -70% 0px',
    threshold: 0
  });

  headings.forEach((heading: Element) => {
    observer.value?.observe(heading);
  });
};

watch([() => props.section, () => props.filename, locale], ([newSection, newFilename, newLocale]) => {
  loadMarkdown(newLocale, newSection, newFilename);
}, { immediate: true });

onMounted(() => {
  watch(markdownContent, () => {
    nextTick(() => {
      setupIntersectionObserver();
    });
  }, { immediate: true });
});

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
});
</script>
