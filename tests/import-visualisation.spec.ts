import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import './types/global.d.ts';

const projectRoot = process.cwd();
const fixturesDir = path.join(projectRoot, 'tests', 'fixtures');


/**
 * Tests d'import de fichiers de mesure et de calibration pour la partie visualisation
 */
test.describe('Tests d\'import de fichiers de mesure seuls', () => {


  /**
   * Fonction d'aide pour tester l'import d'un fichier de mesure et la visualisation du graphique
   * @param page - Instance de la page Playwright
   * @param fileExtension - Extension du fichier à importer (sans le point)
   */
  async function testFileImportAndVisualization(page, fileExtension) {
    await page.goto('/#/visualisation');
    await page.waitForLoadState('networkidle');

    const testFilePath = path.join(fixturesDir, `visualisation.${fileExtension}`);
    console.log(`Test d'import du fichier: ${testFilePath}`);

    if (!fs.existsSync(testFilePath)) {
      throw new Error(`Le fichier de test n'existe pas: ${testFilePath}`);
    }

    const fileInput = await page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(testFilePath);

    const canvas = await page.waitForSelector('canvas', { timeout: 15000 });
    expect(canvas).toBeTruthy();

    const chartExists = await page.waitForFunction(() => {
      try {
        return window.hasOwnProperty('Chart') && window.Chart !== null;
      } catch (e) {
        return false;
      }
    }, { timeout: 10000, polling: 500 }).catch(() => false);

    expect(chartExists).toBeTruthy();
  }

  const fileExtensions = ['csv', 'mv', 'txt', 'xml'];

  for (const extension of fileExtensions) {
    test(`Should display a graph if a ${extension} metrics file is imported`, async ({ page }) => {
      await testFileImportAndVisualization(page, extension);
    });
  }
});
