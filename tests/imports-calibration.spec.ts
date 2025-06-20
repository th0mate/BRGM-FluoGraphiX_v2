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

    // test(`Should display a correct graph after import CSV calibration file`, async ({page}) => {
    //     //TODO : l'input n'est pas créé dans la vue, donc pour le moment ne fonctionne pas
    //     await testFileImportAndVisualization(page, 'csv');
    //
    //     const expectedValues = {
    //         'Calibration': {first: 0.001, last: 120.183},
    //     };
    //
    //     const chartPoints = await getChartInstance(page);
    //     expect(chartPoints).toBeTruthy();
    //
    //     compareChartPointsWithExpected(chartPoints, expectedValues);
    // });
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

    const testFilePath = path.join(fixturesDir, `calibration.${fileExtension}`);
    console.log(`Test d'import du fichier: ${testFilePath}`);

    if (!fs.existsSync(testFilePath)) {
        throw new Error(`Le fichier de test n'existe pas: ${testFilePath}`);
    }

    await page.waitForTimeout(1000);
    const traceurs = await getTraceursFromSession(page);
    expect(validateTraceurs(traceurs)).toBeTruthy();
}