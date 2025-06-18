/**
 * Utilitaires pour interagir avec les graphiques Chart.js dans les tests
 */
import '../types/global.d.ts';



/**
 * Récupère le premier graphique Chart.js dans la page
 */
export async function getChartInstance(page) {
  return await page.evaluate(() => {
    if (!window.Chart) return null;
    let chart = null;
    const canvas = document.querySelector('canvas');
    if (typeof window.Chart.getChart === 'function' && canvas) {
      chart = window.Chart.getChart(canvas);
    } else if (window.Chart.instances && Object.values(window.Chart.instances).length) {
      chart = Object.values(window.Chart.instances)[0];
    } else if (window.Chart.registry && window.Chart.registry._charts && window.Chart.registry._charts.size) {
      chart = Array.from(window.Chart.registry._charts.values())[0];
    }
    if (!chart?.data?.datasets) return null;
    return chart.data.datasets.map(ds => ({
      label: ds.label,
      first: ds.data[0],
      last: ds.data.at(-1)
    }));
  });
}


/**
 * Attend que le graphique soit chargé et visible
 */
export async function waitForChartToBeReady(page, timeoutMs = 30000) {
  await page.waitForSelector('canvas', { timeout: timeoutMs });
  return await page.waitForFunction(() => {
    if (!window.Chart) return false;
    let chart = null;
    const canvas = document.querySelector('canvas');
    if (typeof window.Chart.getChart === 'function' && canvas) {
      chart = window.Chart.getChart(canvas);
    } else if (window.Chart.instances && Object.values(window.Chart.instances).length) {
      chart = Object.values(window.Chart.instances)[0];
    } else if (window.Chart.registry && window.Chart.registry._charts && window.Chart.registry._charts.size) {
      chart = Array.from(window.Chart.registry._charts.values())[0];
    }
    return chart && chart.data && Array.isArray(chart.data.datasets) && chart.data.datasets.length > 0;
  }, { timeout: timeoutMs, polling: 500 });
}


/**
 * Extrait la valeur Y d'un point de données du graphique
 */
export function getYValue(val) {
  if (val == null) return NaN;
  if (typeof val === 'number') return val;
  if (typeof val === 'object' && val !== null) return val.y ?? val.value ?? NaN;
  return parseFloat(val);
}
