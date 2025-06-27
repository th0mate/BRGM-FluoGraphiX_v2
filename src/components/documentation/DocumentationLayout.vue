<template>
  <div class="documentation-layout">
    <aside class="left-sidebar">
      <div v-for="section in documentationStructure" :key="section.titleKey">
        <h3>{{ $t(section.titleKey) }}</h3>
        <ul>
          <template v-for="page in section.pages" :key="page.section + '/' + page.filename">
            <li class="page-item">
              <router-link :to="`/documentation/${page.section}/${page.filename}`">{{ $t(page.titleKey) }}</router-link>
            </li>
            <li v-if="page.subsections && $route.path === `/documentation/${page.section}/${page.filename}`">
              <ul class="subsections">
                <li v-for="subsection in page.subsections" :key="subsection.id">
                  <a :href="`#${subsection.id}`" @click.prevent="scrollToHeading(subsection.id)" :style="{ marginLeft: (subsection.level || 2) * 10 + 'px' }">
                    {{ $t(subsection.titleKey) }}
                  </a>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </aside>
    <main class="main-content">
      <slot></slot>
    </main>
    <aside class="right-sidebar">
      <h3>{{ $t('documentation.inThisSection') }}</h3>
      <div class="active-line-container">
        <div class="active-line" :style="{ top: activeLineTop, height: activeLineHeight }"></div>
        <ul>
          <li class="line"></li>
          <li v-for="heading in filteredHeadings" :key="heading.id">
            <a
              :href="`#${heading.id}`"
              @click.prevent="scrollToHeading(heading.id)"
              :style="{ marginLeft: (heading.level - 1) * 10 + 'px' }"
              :class="{ 'active-heading': activeHeadingId === heading.id }"
            >
              {{ heading.text }}
            </a>
          </li>
        </ul>
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
});

const { t } = useI18n();
const route = useRoute();

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
.documentation-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  padding: 0;
}

.left-sidebar {
  flex: 0 0 300px;
  background-color: #f0f0f0;
  padding: 15px;
  border-radius: 0;
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100vh;
  overflow-y: auto;
}

.left-sidebar ul {
  list-style: none;
  padding: 0;
}

.left-sidebar ul li.page-item {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.left-sidebar ul li.page-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

.left-sidebar ul li a {
  display: block;
  padding: 5px 15px;
  color: #333;
  text-decoration: none;
}

.left-sidebar ul li a:hover {
  color: var(--orangeBRGM);
}

.left-sidebar ul li a.router-link-active {
  font-weight: bold;
  color: var(--orangeBRGM);
}

.left-sidebar .subsections {
  list-style: none;
  padding-left: 20px;
  margin-top: 5px;
  margin-bottom: 10px;
}

.page-item {
  font-weight: bold;
}

.left-sidebar .subsections li a {
  padding: 3px 0;
  font-size: 0.9em;
  color: #555;
}

.left-sidebar .subsections li a:hover {
  color: var(--orangeBRGM);
}

.main-content {
  flex-grow: 1;
  background-color: rgba(255, 255, 255, 0.6);
  padding: 20px 50px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.right-sidebar {
  flex: 0 0 300px;
  background-color: rgba(255, 255, 255, 0.6);
  padding: 15px;
  border-radius: 0;
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100vh;
  overflow-y: hidden;
}

.active-line-container {
  position: relative;
  height: 100%;
}

.active-line {
  position: absolute;
  left: -0.9px;
  width: 4px;
  border-radius: 2px;
  background-color: var(--orangeBRGM);
  transition: top 0.3s ease, height 0.3s ease;
  z-index: 1;
}

.right-sidebar ul {
  list-style: none;
  padding: 0;
  padding-left: 15px;
  border-left: 2px solid #cacaca;
}

.right-sidebar li a {
  display: block;
  padding: 5px 0;
  color: #333;
  text-decoration: none;
  position: relative;
}

.right-sidebar li a:hover {
  color: var(--orangeBRGM);
}

.right-sidebar li a.active-heading {
  font-weight: bold;
  color: var(--orangeBRGM);
}
</style>
