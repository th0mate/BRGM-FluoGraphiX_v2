import {test, expect} from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import './types/global.d.ts';
import { parseFileContent, normalize, findColIdx } from './utils/file-parsing';
import { getChartInstance, waitForChartToBeReady, getYValue } from './utils/chart-utils';
import { getTraceursFromSession, validateTraceurs } from './utils/traceur-utils';

const projectRoot = process.cwd();
const fixturesDir = path.join(projectRoot, 'tests', 'fixtures');

/**
 * =====================================================================================================================
 * CONSTANTES
 * =====================================================================================================================
 */
const TIMEOUT_CHART = 30000;  // 30 secondes pour le chargement des graphiques


/**
 * =====================================================================================================================
 * TESTS
 * =====================================================================================================================
 */


/**
 * Tests d'import de fichiers de mesure seuls la partie visualisation
 */
test.describe('Tests for importing measurement files alone (visualisation)', () => {

    test(`Should display a graph if a TXT metrics file is imported`, async ({page}) => {
        await testFileImportAndVisualization(page, 'txt');
    });

    test(`Should display a graph if a MV metrics file is imported`, async ({page}) => {
        await testFileImportAndVisualization(page, 'mv');
    });

    test(`Should display a graph if a XML metrics file is imported`, async ({page}) => {
        await testFileImportAndVisualization(page, 'xml');
    });

    test(`Should display a graph if a CSV metrics file is imported`, async ({page}) => {
        await testFileImportAndVisualization(page, 'csv');
    });
});


/**
 * Tests d'import de fichiers de mesure + fichiers de calibration sur la partie visualisation
 */
test.describe('Import tests of measurement files + calibration files (visualisation)', () => {
    test(`Should display a graph if a TXT metrics file + CSV calibration file are imported`, async ({page}) => {
        await testFileImportWithCalibration(page, 'txt', 'csv');
    });

    test(`Should display a graph if a MV metrics file + DAT calibration file are imported`, async ({page}) => {
        await testFileImportWithCalibration(page, 'mv', 'dat');
    });

    test(`Should display a graph if a XML metrics file + CSV calibration file are imported`, async ({page}) => {
        await testFileImportWithCalibration(page, 'xml', 'csv');
    });

    test(`Should display a graph if a CSV metrics file + DAT calibration file are imported`, async ({page}) => {
        await testFileImportWithCalibration(page, 'csv', 'dat');
    });

    test(`Should display a graph if a TXT metrics file + DAT calibration file are imported`, async ({page}) => {
        await testFileImportWithCalibration(page, 'txt', 'dat');
    });

    test(`Should display a graph if a MV metrics file + CSV calibration file are imported`, async ({page}) => {
        await testFileImportWithCalibration(page, 'mv', 'csv');
    });

    test(`Should display a graph if a XML metrics file + DAT calibration file are imported`, async ({page}) => {
        await testFileImportWithCalibration(page, 'xml', 'dat');
    });

    test(`Should display a graph if a CSV metrics file + CSV calibration file are imported`, async ({page}) => {
        await testFileImportWithCalibration(page, 'csv', 'csv');
    });
});


/**
 * =====================================================================================================================
 * FONCTIONS UTILITAIRES
 * =====================================================================================================================
 */


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

    const fileContent = fs.readFileSync(testFilePath, 'utf-8');
    await page.locator('input[type="file"]').first().setInputFiles(testFilePath);

    await waitForChartToBeReady(page, TIMEOUT_CHART);

    const { headers, first: fileFirst, last: fileLast } = parseFileContent(fileContent, fileExtension);

    const chartPoints = await getChartInstance(page);
    expect(chartPoints).toBeTruthy();

    for (const chart of chartPoints) {
        let colIdx = findColIdx(chart.label, headers);
        if (colIdx === -1 && fileExtension !== 'xml') {
            console.log(`Label dataset: ${chart.label} | Index trouvé: -1 | ignoré (pas de colonne correspondante)`);
            continue;
        }

        const fileFirstNum = fileExtension === 'xml'
            ? parseFloat(fileFirst[chartPoints.indexOf(chart)])
            : parseFloat(fileFirst[colIdx]);
        const fileLastNum = fileExtension === 'xml'
            ? parseFloat(fileLast[chartPoints.indexOf(chart)])
            : parseFloat(fileLast[colIdx]);

        const chartFirstNum = getYValue(chart.first);
        const chartLastNum = getYValue(chart.last);

        console.log(`Comparaison pour ${chart.label} : fichier(${fileFirstNum}, ${fileLastNum}) vs courbe(${chartFirstNum}, ${chartLastNum})`);

        expect(chartFirstNum).toBeCloseTo(fileFirstNum, 1);
        expect(chartLastNum).toBeCloseTo(fileLastNum, 1);
    }
}


/**
 * Fonction d'aide pour tester l'import combiné d'un fichier de mesure et d'un fichier de calibration
 * @param page - Instance de la page Playwright
 * @param metricFileExtension - Extension du fichier de mesure à importer (sans le point)
 * @param calibFileExtension - Extension du fichier de calibration à importer (sans le point)
 */
async function testFileImportWithCalibration(page, metricFileExtension, calibFileExtension) {
    await page.goto('/#/visualisation');
    await page.waitForLoadState('networkidle');

    const metricFilePath = path.join(fixturesDir, `visualisation.${metricFileExtension}`);
    const calibFilePath = path.join(fixturesDir, `calibration.${calibFileExtension}`);
    console.log(`Test d'import des fichiers: ${metricFilePath} + ${calibFilePath}`);

    for (const filePath of [metricFilePath, calibFilePath]) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`Le fichier de test n'existe pas: ${filePath}`);
        }
    }

    await page.locator('input[type="file"]').setInputFiles([metricFilePath, calibFilePath]);

    await waitForChartToBeReady(page, TIMEOUT_CHART);

    const metricFileContent = fs.readFileSync(metricFilePath, 'utf-8');

    const traceurs = await getTraceursFromSession(page);
    console.log('Traceurs détectés:', traceurs);

    expect(validateTraceurs(traceurs)).toBeTruthy();

    const metricData = parseFileContent(metricFileContent, metricFileExtension);

    const chartPoints = await getChartInstance(page);
    expect(chartPoints).toBeTruthy();

    for (const chart of chartPoints) {
        let colIdx = findColIdx(chart.label, metricData.headers);
        if (colIdx === -1 && metricFileExtension !== 'xml') {
            console.log(`Label dataset: ${chart.label} | Index trouvé: -1 | ignoré (pas de colonne correspondante)`);
            continue;
        }

        const metricFileFirstNum = metricFileExtension === 'xml'
            ? parseFloat(metricData.first[chartPoints.indexOf(chart)])
            : parseFloat(metricData.first[colIdx]);
        const metricFileLastNum = metricFileExtension === 'xml'
            ? parseFloat(metricData.last[chartPoints.indexOf(chart)])
            : parseFloat(metricData.last[colIdx]);

        const chartFirstNum = getYValue(chart.first);
        const chartLastNum = getYValue(chart.last);

        console.log(`Comparaison pour ${chart.label} : fichier(${metricFileFirstNum}, ${metricFileLastNum}) vs courbe(${chartFirstNum}, ${chartLastNum})`);

        expect(chartFirstNum).toBeCloseTo(metricFileFirstNum, 1);
        expect(chartLastNum).toBeCloseTo(metricFileLastNum, 1);
    }
}
