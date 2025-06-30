import type { RouteRecordRaw } from 'vue-router';

interface DocSection {
  titleKey: string;
  pages: DocPage[];
}

interface DocPage {
  titleKey: string;
  section: string;
  filename: string;
  subsections?: { titleKey: string; id: string; }[];
}

export const documentationStructure: DocSection[] = [
  {
    titleKey: 'documentation.guide.title',
    pages: [
      {
        titleKey: 'documentation.guide.introduction',
        section: 'guide',
        filename: 'introduction',
      },
      {
        titleKey: 'documentation.guide.visualisation',
        section: 'guide',
        filename: 'visualisation',
      },
      {
        titleKey: 'documentation.guide.calibration',
        section: 'guide',
        filename: 'calibration',
      },
    ],
  },
];

export const generateDocRoutes = (): RouteRecordRaw[] => {
  const routes: RouteRecordRaw[] = [];
  documentationStructure.forEach(section => {
    section.pages.forEach(page => {
      routes.push({
        path: `/documentation/${page.section}/${page.filename}`,
        name: `doc-${page.section}-${page.filename}`,
        component: () => import('@/components/documentation/MarkdownLoader.vue'),
        props: route => ({ section: page.section, filename: page.filename }),
      });
    });
  });
  return routes;
};
