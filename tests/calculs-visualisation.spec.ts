import {test, expect} from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import './types/global.d.ts';
import {getChartInstance, waitForChartToBeReady, getYValue} from './utils/chart-utils';

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

        compareChartPointsWithExpected(chartPoints, expectedValues);
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

        compareChartPointsWithExpected(chartPoints, expectedValues);
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

        compareChartPointsWithExpected(chartPoints, expectedValues);
    });


    test(`Should display a correct graph after correction of bk noise without chart selection for two variables`, async ({page}) => {
        await initTestCalculationsVisualisation(page);
        await page.getByRole('button', {name: 'Next slide'}).click();
        await page.getByRole('button', {name: 'Next slide'}).click();
        await page.locator('#deuxTraceurInterf').click();
        await page.waitForTimeout(500);
        await page.waitForSelector('#selecttone', {timeout: 5000});
        await page.waitForSelector('#selecttwo', {timeout: 5000});

        await page.selectOption('#selecttone', '1');
        await page.selectOption('#selecttwo', '2');

        await page.locator('#declencherCorrectionInterf').click();
        await page.waitForTimeout(1000);

        await page.getByRole('button', {name: 'Next slide'}).click();
        await page.locator('#declencherCorrectionBk').click();
        await page.waitForTimeout(1000);

        const chartPoints = await getChartInstance(page);
        const expectedValues = {
            'L2Nat': {first: 11.47, last: 12.87},
            'L1Corr_nat': {first: 0.82, last: 1.61},
            'L1Nat': {first: 0.78, last: 2.16},
            'L1Corr': {first: 0.41, last: 2.58},
            'L2Corr_nat': {first: 0.03, last: 0.47},
        };

        compareChartPointsWithExpected(chartPoints, expectedValues);
    });


    test(`Should display a correct graph after correction of bk noise with chart selection for two variables`, async ({page}) => {
        await initTestCalculationsVisualisation(page);
        await page.getByRole('button', {name: 'Next slide'}).click();
        await page.getByRole('button', {name: 'Next slide'}).click();
        await page.locator('#deuxTraceurInterf').click();
        await page.waitForTimeout(500);
        await page.waitForSelector('#selecttone', {timeout: 5000});
        await page.waitForSelector('#selecttwo', {timeout: 5000});

        await page.selectOption('#selecttone', '1');
        await page.selectOption('#selecttwo', '2');

        await page.locator('#declencherCorrectionInterf').click();
        await page.waitForTimeout(1000);

        await page.getByRole('button', {name: 'Next slide'}).click();

        await page.locator('#debutSelection').fill('2023-10-20T15:00');
        await page.locator('#finSelection').fill('2023-10-22T03:00');

        await page.locator('#declencherCorrectionBk').click();
        await page.waitForTimeout(1000);

        const chartPoints = await getChartInstance(page);
        const expectedValues = {
            'L2Nat': {first: 11.32, last: 12.90},
            'L1Corr_nat': {first: 1.15, last: 1.54},
            'L1Nat': {first: 0.45, last: 2.23},
            'L1Corr': {first: 0.41, last: 2.58},
            'L2Corr_nat': {first: 0.18, last: 0.44},
        };

        compareChartPointsWithExpected(chartPoints, expectedValues);
    });


    test(`Should display a correct graph after concentration conversion for one tracer`, async ({page}) => {
        await initTestCalculationsVisualisation(page);
        await page.getByRole('button', {name: 'Next slide'}).click();
        await page.getByRole('button', {name: 'Next slide'}).click();
        await page.getByRole('button', {name: 'Next slide'}).click();

        await page.getByText('Uranine').click();
        await page.locator('#declencherConversion').click();
        await page.waitForTimeout(1000);

        const chartPoints = await getChartInstance(page);
        const expectedValues = {
            'Uranine_ppb': {first: 0.30, last: 0.69},
        };

        compareChartPointsWithExpected(chartPoints, expectedValues);
    });


    test(`Should display a correct graph after deleting curves`, async ({page}) => {
        await initTestCalculationsVisualisation(page);
        await page.getByRole('button', {name: 'Next slide'}).click();
        await page.getByRole('button', {name: 'Next slide'}).click();
        await page.getByRole('button', {name: 'Next slide'}).click();
        await page.getByRole('button', {name: 'Next slide'}).click();
        await page.getByRole('button', {name: 'Next slide'}).click();

        await page.getByText('A144').click();
        await page.locator('#declencherSuppression').click();

        await page.waitForTimeout(1000);
        const chartPoints = await getChartInstance(page);

        for (const dataset of chartPoints) {
            expect(dataset.label).not.toBe('A144');
        }
    });


    test(`Should export a correct CSV file after classic export`, async ({page}) => {
        await initTestCalculationsVisualisation(page);
        await page.getByRole('button', {name: 'Next slide'}).click();
        await page.getByRole('button', {name: 'Next slide'}).click();
        await page.getByRole('button', {name: 'Next slide'}).click();
        await page.getByRole('button', {name: 'Next slide'}).click();

        const [download] = await Promise.all([
            page.waitForEvent('download'),
            page.locator('#declencherExportCSV').click()
        ]);
        const downloadedFilePath = await download.path();
        const downloadedContent = fs.readFileSync(downloadedFilePath, 'utf-8');
        const expectedFilePath = path.join(fixturesDir, 'expected_csv_export.csv');
        const expectedContent = fs.readFileSync(expectedFilePath, 'utf-8');
        const downloadedLines = downloadedContent.split('\n').slice(1).map(line => line.trim());
        const expectedLines = expectedContent.split('\n').slice(1).map(line => line.trim());
        expect(downloadedLines).toEqual(expectedLines);
    });


    test(`Should export a correct CSV file after TRAC export`, async ({page, browserName}) => {
        await initTestCalculationsVisualisation(page);
        await page.getByRole('button', {name: 'Next slide'}).click();
        await page.getByRole('button', {name: 'Next slide'}).click();
        await page.getByRole('button', {name: 'Next slide'}).click();

        await page.getByText('Uranine').click();
        await page.locator('#declencherConversion').click();
        await page.waitForTimeout(1000);

        await page.getByRole('button', {name: 'Next slide'}).click();

        await page.getByLabel('5 of').getByText('Uranine').click();
        await page.locator('#dateInjection').fill('2023-10-18T00:00');

        await page.waitForTimeout(500);

        // Pour les autres navigateurs, utiliser la méthode standard
        const [download] = await Promise.all([
            page.waitForEvent('download'),
            page.locator('#declencherExportTRAC').click()
        ]);

        const downloadedFilePath = await download.path();
        const downloadedContent = fs.readFileSync(downloadedFilePath, 'utf-8');
        const expectedFilePath = path.join(fixturesDir, 'expected_trac_export.csv');
        const expectedContent = fs.readFileSync(expectedFilePath, 'utf-8');
        const downloadedLines = downloadedContent.split('\n').slice(1).map(line => line.trim());
        const expectedLines = expectedContent.split('\n').slice(1).map(line => line.trim());
        expect(downloadedLines).toEqual(expectedLines);

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

function compareChartPointsWithExpected(chartPoints, expectedValues) {
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
}