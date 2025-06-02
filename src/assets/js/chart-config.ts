/**
 * Configuration de Chart.js v4
 */
import { Chart } from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(zoomPlugin, annotationPlugin);

declare global {
  interface Window {
    Chart: typeof Chart;
  }
}

export default Chart;
