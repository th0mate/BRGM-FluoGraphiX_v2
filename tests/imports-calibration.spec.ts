import {test, expect} from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import './types/global.d.ts';
import {getChartInstance, waitForChartToBeReady, getYValue, compareChartPointsWithExpected} from './utils/chart-utils';
import { getTraceursFromSession, validateTraceurs } from './utils/traceur-utils';

const projectRoot = process.cwd();
const fixturesDir = path.join(projectRoot, 'tests', 'fixtures');


/**
 * =====================================================================================================================
 * TESTS
 * =====================================================================================================================
 */


test.describe('Tests for importing calibration files (calibration)', () => {

    test(`Should display a correct graph after import CSV calibration file`, async ({page}) => {
        await testFileImportAndVisualization(page, 'csv');
        await verifyCalibrationGraphs(page);
    });

    test(`Should display a correct graph after import DAT calibration file`, async ({page}) => {
        await testFileImportAndVisualization(page, 'dat');
        await verifyCalibrationGraphs(page);
    });
});


/**
 * =====================================================================================================================
 * FONCTIONS UTILITAIRES
 * =====================================================================================================================
 */


/**
 * Fonction d'aide pour tester l'import d'un fichier de mesure et l'affichage
 * @param page - Instance de la page Playwright
 * @param fileExtension - Extension du fichier à importer (sans le point)
 */
async function testFileImportAndVisualization(page, fileExtension) {
    await page.goto('/#/calibration');
    await page.waitForLoadState('networkidle');
    await page.locator('#declencherCalibration').click();

    const testFilePath = path.join(fixturesDir, `calibration.${fileExtension}`);
    console.log(`Test d'import du fichier: ${testFilePath}`);

    if (!fs.existsSync(testFilePath)) {
        throw new Error(`Le fichier de test n'existe pas: ${testFilePath}`);
    }

    await page.locator('input[type="file"]').first().setInputFiles(testFilePath);

    await page.waitForTimeout(1000);
    const traceurs = await getTraceursFromSession(page);
    expect(validateTraceurs(traceurs)).toBeTruthy();
}


/**
 * Vérifie toutes les données des graphes de calibration pour tous les traceurs et lampes
 * @param page - Instance de la page Playwright
 */
async function verifyCalibrationGraphs(page) {
    const expectedUranineL1 = {
        'Calibration': {first: 0.001, last: 120.18},
    };
    let chartPoints = await getChartInstance(page);
    expect(chartPoints).toBeTruthy();
    compareChartPointsWithExpected(chartPoints, expectedUranineL1);

    await page.locator('#lampe2').click();
    const expectedUranineL2 = {
        'Signaux parasites': {first: 0.27, last: 48.51},
    };
    chartPoints = await getChartInstance(page);
    expect(chartPoints).toBeTruthy();
    compareChartPointsWithExpected(chartPoints, expectedUranineL2);

    await page.locator('#lampe3').click();
    const expectedUranineL3 = {
        'Signaux parasites': {first: 0.61, last: 28.27},
    };
    chartPoints = await getChartInstance(page);
    expect(chartPoints).toBeTruthy();
    compareChartPointsWithExpected(chartPoints, expectedUranineL3);

    await page.locator('#lampe4').click();
    const expectedUranineL4 = {
        'Signaux parasites': {first: 21.98, last: 24.91},
    };
    chartPoints = await getChartInstance(page);
    expect(chartPoints).toBeTruthy();
    compareChartPointsWithExpected(chartPoints, expectedUranineL4);

    await page.getByText('SrhodaminB').click();
    const expectedSulfoL2 = {
        'Calibration': {first: 0.004, last: 120.54},
    };
    chartPoints = await getChartInstance(page);
    expect(chartPoints).toBeTruthy();
    compareChartPointsWithExpected(chartPoints, expectedSulfoL2);

    await page.locator('#lampe1').click();
    const expectedSulfoL1 = {
        'Signaux parasites': {first: 1.19, last: 49.195},
    };
    chartPoints = await getChartInstance(page);
    expect(chartPoints).toBeTruthy();
    compareChartPointsWithExpected(chartPoints, expectedSulfoL1);

    await page.locator('#lampe3').click();
    const expectedSulfoL3 = {
        'Signaux parasites': {first: 0.61, last: 2.90},
    };
    chartPoints = await getChartInstance(page);
    expect(chartPoints).toBeTruthy();
    compareChartPointsWithExpected(chartPoints, expectedSulfoL3);

    await page.locator('#lampe4').click();
    const expectedSulfoL4 = {
        'Signaux parasites': {first: 21.98, last: 24.53},
    };
    chartPoints = await getChartInstance(page);
    expect(chartPoints).toBeTruthy();
    compareChartPointsWithExpected(chartPoints, expectedSulfoL4);

    await page.getByText('AminoGacid').click();
    const expectedAminoGacidL3 = {
        'Calibration': {first: 0.01, last: 121.66},
    };
    chartPoints = await getChartInstance(page);
    expect(chartPoints).toBeTruthy();
    compareChartPointsWithExpected(chartPoints, expectedAminoGacidL3);

    await page.locator('#lampe1').click();
    const expectedAminoGacidL1 = {
        'Signaux parasites': {first: 1.19, last: 2.40},
    };
    chartPoints = await getChartInstance(page);
    expect(chartPoints).toBeTruthy();
    compareChartPointsWithExpected(chartPoints, expectedAminoGacidL1);

    await page.locator('#lampe2').click();
    const expectedAminoGacidL2 = {
        'Signaux parasites': {first: 0.27, last: 0.77},
    };
    chartPoints = await getChartInstance(page);
    expect(chartPoints).toBeTruthy();
    compareChartPointsWithExpected(chartPoints, expectedAminoGacidL2);

    await page.locator('#lampe4').click();
    const expectedAminoGacidL4 = {
        'Signaux parasites': {first: 21.98, last: 24.54},
    };
    chartPoints = await getChartInstance(page);
    expect(chartPoints).toBeTruthy();
    compareChartPointsWithExpected(chartPoints, expectedAminoGacidL4);

    await page.getByText('Turbidité').click();
    await page.waitForTimeout(500);
    const expectedATurbidityL4 = {
        'Calibration': {first: 0, last: 121.42},
    };
    chartPoints = await getChartInstance(page);
    expect(chartPoints).toBeTruthy();
    compareChartPointsWithExpected(chartPoints, expectedATurbidityL4);

    await page.locator('#lampe3').click();
    await page.waitForTimeout(1000);
    const popup = await page.locator('.popup');
    expect(await popup.isVisible()).toBeTruthy();
}