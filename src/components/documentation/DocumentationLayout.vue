<template>
  <div class="documentation-layout">

    <div v-if="props.isLeftSidebarOpen || props.isRightSidebarOpen" class="overlay" @click="closeSidebars"></div>

    <aside class="left-sidebar" :class="{ 'is-open': props.isLeftSidebarOpen }">
      <div class="sidebar-content-wrapper">
        <div v-for="section in documentationStructure" :key="section.titleKey">
          <h3>{{ $t(section.titleKey) }}</h3>
          <ul>
            <template v-for="page in section.pages" :key="page.section + '/' + page.filename">
              <li class="page-item">
                <router-link :to="`/documentation/${page.section}/${page.filename}`" @click="closeSidebars">{{ $t(page.titleKey + '.title') }}</router-link>
              </li>
              <li v-if="page.subsections && $route.path === `/documentation/${page.section}/${page.filename}`">
                <ul class="subsections">
                  <li v-for="subsection in page.subsections" :key="subsection.id">
                    <a :href="`#${subsection.id}`" @click.prevent="scrollToHeading(subsection.id); closeSidebars()" :style="{ marginLeft: (subsection.level || 2) * 10 + 'px' }">
                      {{ $t(subsection.titleKey) }}
                    </a>
                  </li>
                </ul>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <slot></slot>
    </main>

    <aside class="right-sidebar" :class="{ 'is-open': props.isRightSidebarOpen }">
      <div class="sidebar-content-wrapper">
        <h3>{{ $t('documentation.inThisSection') }}</h3>
        <div class="active-line-container">
          <div class="active-line" :style="{ top: activeLineTop, height: activeLineHeight }"></div>
          <ul>
            <li class="line"></li>
            <li v-for="heading in filteredHeadings" :key="heading.id">
              <a
                :href="`#${heading.id}`"
                @click.prevent="scrollToHeading(heading.id); closeSidebars()"
                :style="{ marginLeft: '10px' }"
                :class="{ 'active-heading': activeHeadingId === heading.id }"
              >
                {{ heading.text }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { documentationStructure } from '@/docs/docsConfig';
import { useI18n } from 'vue-i18n';
import { defineProps, watch, ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  headings: {
    type: Array as () => { id: string; text: string; level: number }[],
    default: () => [],
  },
  activeHeadingId: {
    type: String,
    default: null,
  },
  isLeftSidebarOpen: {
    type: Boolean,
    default: false,
  },
  isRightSidebarOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close-sidebars']);

const closeSidebars = () => {
  emit('close-sidebars');
};

const scrollToHeading = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

const filteredHeadings = computed(() => {
  return props.headings.filter(h => h.level !== 1);
});

const activeLineTop = ref('0px');
const activeLineHeight = ref('0px');

const updateActiveLinePosition = () => {
  if (props.activeHeadingId) {
    const activeLink = document.querySelector(`.right-sidebar li a[href="#${props.activeHeadingId}"]`);
    if (activeLink) {
      const ul = activeLink.closest('ul');
      if (ul) {
        activeLineTop.value = `${activeLink.offsetTop - ul.offsetTop}px`;
        activeLineHeight.value = `${activeLink.offsetHeight}px`;
      }
    }
  } else {
    activeLineTop.value = '0px';
    activeLineHeight.value = '0px';
  }
};

watch(() => props.activeHeadingId, () => {
  updateActiveLinePosition();
}, { immediate: true });

onMounted(() => {
  window.addEventListener('resize', updateActiveLinePosition);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateActiveLinePosition);
});
</script>

<style scoped>
@import '@/assets/styles/documentation.css';

h3 {
  color: var(--grisBRGM);
  font-family: gibson-semibold;
  font-weight: 400;
  margin-bottom: 20px;
}
</style>

<style scoped>
h3 {
  color: var(--grisBRGM);
  font-family: gibson-semibold;
  font-weight: 400;
  margin-bottom: 20px;
}
</style>
