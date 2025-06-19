import {test, expect} from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import './types/global.d.ts';
import {parseFileContent, normalize, findColIdx} from './utils/file-parsing';
import {getChartInstance, waitForChartToBeReady, getYValue} from './utils/chart-utils';
import {getTraceursFromSession, validateTraceurs} from './utils/traceur-utils';

const projectRoot = process.cwd();
const fixturesDir = path.join(projectRoot, 'tests', 'fixtures');


/**
 * =====================================================================================================================
 * TESTS
 * =====================================================================================================================
 */
test.describe('Tests for calculations and corrections of measurement data (visualisation)', () => {

    test(`Should display a correct graph after turbidity correction on all lamps`, async ({page}) => {
        await initTestCalculationsVisualisation(page);
        await page.getByRole('button', {name: 'Next slide'}).click();
        await page.getByLabel('2 of').getByText('L1').click();
        await page.getByLabel('2 of').getByText('L2').click();
        await page.getByLabel('2 of').getByText('L3').click();
        await page.locator('#inputRange').fill('2');
        await page.locator('#declencherCorrectionTurbidite').click();


        await page.waitForTimeout(1000);

        const chartPoints = await getChartInstance(page);

        const expectedValues = {
            'L1Corr': {first: 1.04, last: 3.49},
            'L2Corr': {first: 9.98, last: 11.87},
            'L3Corr': {first: 7.91, last: 21.98}
        };

        let comparisonsMade = 0;

        for (const dataset of chartPoints) {
            if (Object.keys(expectedValues).includes(dataset.label)) {
                comparisonsMade++;
                const expected = expectedValues[dataset.label];
                const chartFirstNum = getYValue(dataset.first);
                const chartLastNum = getYValue(dataset.last);

                console.log(`Comparaison pour ${dataset.label} : attendu(${expected.first}, ${expected.last}) vs courbe(${chartFirstNum}, ${chartLastNum})`);

                expect(chartFirstNum).toBeCloseTo(expected.first, 2);
                expect(chartLastNum).toBeCloseTo(expected.last, 2);
            }
        }

        expect(comparisonsMade, "Aucune comparaison de valeurs n'a été effectuée").toBeGreaterThan(0);
    });


    test(`Should display a correct graph after correction of interference between tracers for one tracer`, async ({page}) => {
        await initTestCalculationsVisualisation(page);
        await page.getByRole('button', {name: 'Next slide'}).click();
        await page.getByRole('button', {name: 'Next slide'}).click();
        await page.locator('#unTraceurInterf').click();
        await page.waitForTimeout(500);
        await page.waitForSelector('#selectSeulInterf', {timeout: 5000});

        await page.selectOption('#selectSeulInterf', '1');
        await page.evaluate(() => {
            const select = document.querySelector('#selectSeulInterf');
            if (select) {
                select.dispatchEvent(new Event('change', {bubbles: true}));
            }
        });

        await page.waitForSelector('#declencherCorrectionInterf:not(.disabled)', {timeout: 5000})
            .catch(() => console.log("Le bouton reste désactivé"));

        await page.locator('#declencherCorrectionInterf').click();
        await page.waitForTimeout(1000);

        const chartPoints = await getChartInstance(page);

        const expectedValues = {
            'L2Corr': {first: 11.05, last: 12.85},
            'L3Corr': {first: 10.41, last: 24.63}
        };

        let comparisonsMade = 0;

        for (const dataset of chartPoints) {
            if (Object.keys(expectedValues).includes(dataset.label)) {
                comparisonsMade++;
                const expected = expectedValues[dataset.label];
                const chartFirstNum = getYValue(dataset.first);
                const chartLastNum = getYValue(dataset.last);

                console.log(`Comparaison pour ${dataset.label} : attendu(${expected.first}, ${expected.last}) vs courbe(${chartFirstNum}, ${chartLastNum})`);

                expect(chartFirstNum).toBeCloseTo(expected.first, 2);
                expect(chartLastNum).toBeCloseTo(expected.last, 2);
            }
        }

        expect(comparisonsMade, "Aucune comparaison de valeurs n'a été effectuée").toBeGreaterThan(0);
    });


    test(`Should display a correct graph after correction of interference between tracers for two tracers`, async ({page}) => {
        await initTestCalculationsVisualisation(page);
        await page.getByRole('button', {name: 'Next slide'}).click();
        await page.getByRole('button', {name: 'Next slide'}).click();
        await page.locator('#deuxTraceurInterf').click();
        await page.waitForTimeout(500);
        await page.waitForSelector('#selecttone', {timeout: 5000});
        await page.waitForSelector('#selecttwo', {timeout: 5000});

        await page.selectOption('#selecttone', '1');
        await page.selectOption('#selecttwo', '2');

        await page.waitForSelector('#declencherCorrectionInterf:not(.disabled)', {timeout: 5000})
            .catch(() => console.log("Le bouton reste désactivé"));

        await page.locator('#declencherCorrectionInterf').click();
        await page.waitForTimeout(1000);

        const chartPoints = await getChartInstance(page);

        const expectedValues = {
            'L2Corr': {first: 11.23, last: 13.07},
            'L3Corr': {first: 10.38, last: 24.60}
        };

        let comparisonsMade = 0;

        for (const dataset of chartPoints) {
            if (Object.keys(expectedValues).includes(dataset.label)) {
                comparisonsMade++;
                const expected = expectedValues[dataset.label];
                const chartFirstNum = getYValue(dataset.first);
                const chartLastNum = getYValue(dataset.last);

                console.log(`Comparaison pour ${dataset.label} : attendu(${expected.first}, ${expected.last}) vs courbe(${chartFirstNum}, ${chartLastNum})`);

                expect(chartFirstNum).toBeCloseTo(expected.first, 2);
                expect(chartLastNum).toBeCloseTo(expected.last, 2);
            }
        }

        expect(comparisonsMade, "Aucune comparaison de valeurs n'a été effectuée").toBeGreaterThan(0);
    });
});


/**
 * =====================================================================================================================
 * FONCTIONS UTILITAIRES
 * ====================================================================================================================
 */
async function initTestCalculationsVisualisation(page) {
    await page.goto('/#/visualisation');
    await page.waitForLoadState('networkidle');

    const metricFilePath = path.join(fixturesDir, `visualisation.csv`);
    const calibFilePath = path.join(fixturesDir, `calibration.csv`);

    await page.locator('input[type="file"]').setInputFiles([metricFilePath, calibFilePath]);

    await waitForChartToBeReady(page, 30000);
}