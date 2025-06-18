import {test, expect} from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import './types/global.d.ts';

const projectRoot = process.cwd();
const fixturesDir = path.join(projectRoot, 'tests', 'fixtures');


/**
 * Tests d'import de fichiers de mesure seuls la partie visualisation
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

        const fileContent = fs.readFileSync(testFilePath, 'utf-8');
        await page.locator('input[type="file"]').first().setInputFiles(testFilePath);

        await expect(await page.waitForSelector('canvas', {timeout: 15000})).toBeTruthy();
        await expect(await page.waitForFunction(() => window.Chart && window.Chart !== null, {timeout: 10000, polling: 500})).toBeTruthy();

        function parseFileContent(content, ext) {
            const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
            if (ext === 'csv') {
                const dataLines = lines.filter(l => l.match(/^[0-9]{2}\/\d{2}\/\d{2}/));
                const headers = lines.find(l => l.includes(';'))?.split(';').map(h => h.trim()) || [];
                return {
                    headers,
                    first: dataLines[0]?.split(';').map(x => x.trim()),
                    last: dataLines.at(-1)?.split(';').map(x => x.trim())
                };
            }
            if (ext === 'mv') {
                const headerLine = lines.find(l => l.match(/Tracer/));
                let headers = headerLine ? headerLine.trim().split(/\s{2,}|\t|  +| (?=\S)/g).map(h => h.trim()) : [];
                for (let i = 0; i < headers.length - 1; i++) {
                    if (/^(tracer|traceur|battery|baseline|conductiv)$/i.test(headers[i]) && /^\d+|v|sn$/i.test(headers[i+1])) {
                        headers[i] = headers[i] + ' ' + headers[i+1];
                        headers.splice(i+1, 1);
                        i--;
                    }
                }
                const dataLines = lines.filter(l => l.match(/^\s*\d+ /));
                return {
                    headers,
                    first: dataLines[0]?.trim().split(/\s+/),
                    last: dataLines.at(-1)?.trim().split(/\s+/)
                };
            }
            if (ext === 'txt') {
                let headers = lines[0].split('\t').map(h => h.trim()).filter(h => h && h.match(/[a-zA-Z0-9]/));
                const dataLines = lines.slice(1);
                const clean = line => line.split('\t').filter((_, i) => headers[i] !== undefined);
                return {
                    headers,
                    first: clean(dataLines[0] || ''),
                    last: clean(dataLines.at(-1) || '')
                };
            }
            if (ext === 'xml') {
                const timeBlocks = Array.from(content.matchAll(/<time [^>]*>([\s\S]*?)<\/time>/g));
                const getVals = block => block ? Array.from(block[1].matchAll(/<a\d+ v=\"([\d.]+)\"/g)).map(m => m[1]) : [];
                return {
                    headers: [],
                    first: getVals(timeBlocks[0]),
                    last: getVals(timeBlocks.at(-1))
                };
            }
            return {headers: [], first: [], last: []};
        }

        const normalize = str => (str || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .replace(/traceur/g, 'tracer')
            .replace(/[^a-z0-9]/g, '');

        function findColIdx(label, headers) {
            const normLabel = normalize(label);
            if (normLabel === 't') return headers.findIndex(h => ['t','tdegc','tcc','tdeg'].includes(normalize(h)));
            if (normLabel === 'turbidity') return headers.findIndex(h => normalize(h) === 'turbidity');
            if (/^tracer\d+$/.test(normLabel)) return headers.findIndex(h => normalize(h) === normLabel);
            return headers.findIndex(h => normalize(h) === normLabel);
        }

        const {headers, first: fileFirst, last: fileLast} = parseFileContent(fileContent, fileExtension);

        const chartPoints = await page.evaluate(() => {
            let chart = null;
            const canvas = document.querySelector('canvas');
            if (window.Chart) {
                if (typeof window.Chart.getChart === 'function' && canvas) chart = window.Chart.getChart(canvas);
                else if (window.Chart.instances && Object.values(window.Chart.instances).length) chart = Object.values(window.Chart.instances)[0];
                else if (window.Chart.registry && window.Chart.registry._charts && window.Chart.registry._charts.size) chart = Array.from(window.Chart.registry._charts.values())[0];
            }
            if (!chart?.data?.datasets) return null;
            return chart.data.datasets.map(ds => ({label: ds.label, first: ds.data[0], last: ds.data.at(-1)}));
        });
        expect(chartPoints).toBeTruthy();

        for (const chart of chartPoints) {
            let colIdx = findColIdx(chart.label, headers);
            if (colIdx === -1 && fileExtension !== 'xml') {
                console.log(`Label dataset: ${chart.label} | Index trouvé: -1 | ignoré (pas de colonne correspondante)`);
                continue;
            }
            const fileFirstNum = fileExtension === 'xml' ? parseFloat(fileFirst[chartPoints.indexOf(chart)]) : parseFloat(fileFirst[colIdx]);
            const fileLastNum = fileExtension === 'xml' ? parseFloat(fileLast[chartPoints.indexOf(chart)]) : parseFloat(fileLast[colIdx]);
            const getY = val => (val == null) ? NaN : (typeof val === 'number' ? val : (typeof val === 'object' && val !== null ? (val.y ?? val.value ?? NaN) : parseFloat(val)));
            const chartFirstNum = getY(chart.first);
            const chartLastNum = getY(chart.last);
            console.log(`Comparaison pour ${chart.label} : fichier(${fileFirstNum}, ${fileLastNum}) vs courbe(${chartFirstNum}, ${chartLastNum})`);
            expect(chartFirstNum).toBeCloseTo(fileFirstNum, 1);
            expect(chartLastNum).toBeCloseTo(fileLastNum, 1);
        }
    }

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
