<template>
  <div v-html="renderedMarkdown"></div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import MarkdownIt from 'markdown-it';
import MarkdownItAnchor from 'markdown-it-anchor';
import MarkdownItContainer from 'markdown-it-container';

const props = defineProps({
  markdownContent: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:headings']);

const md = new MarkdownIt({
  html: true,
});
md.use(MarkdownItAnchor, {
  permalink: false,
  slugify: s => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-')),
});

md.use(MarkdownItContainer, 'info', {
  render: function (tokens, idx) {
    if (tokens[idx].nesting === 1) {
      return '<div class="custom-block info">';
    } else {
      return '</div>\n';
    }
  }
});

md.use(MarkdownItContainer, 'warning', {
  render: function (tokens, idx) {
    if (tokens[idx].nesting === 1) {
      return '<div class="custom-block warning">';
    } else {
      return '</div>\n';
    }
  }
});

md.use(MarkdownItContainer, 'important', {
  render: function (tokens, idx) {
    if (tokens[idx].nesting === 1) {
      return '<div class="custom-block important">';
    } else {
      return '</div>\n';
    }
  }
});

const renderedMarkdown = ref('');

watchEffect(() => {
  renderedMarkdown.value = md.render(props.markdownContent);

  const headings: { id: string; text: string; level: number }[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(renderedMarkdown.value, 'text/html');
  doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
    if (heading.id && heading.textContent) {
      headings.push({
        id: heading.id,
        text: heading.textContent,
        level: parseInt(heading.tagName.substring(1)),
      });
    }
  });
  emit('update:headings', headings);
});
</script>
