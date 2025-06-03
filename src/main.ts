import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import Tooltip from "primevue/tooltip";
import Button from "primevue/button";
import Dialog from "primevue/dialog";

// Import de la configuration Chart.js (fichier TypeScript)
import Chart from './assets/js/chart-config';

// Enregistrement de Chart.js dans la fenêtre pour compatibilité avec le code existant
window.Chart = Chart;

// Utilisation de l'import direct du thème Aura en mode light
import Aura from '@primeuix/themes/aura';

const app = createApp(App)

// Enregistrement du composant Tooltip globalement
app.directive('tooltip', Tooltip);

// Configuration de PrimeVue avec le thème Aura en mode clair
app.use(PrimeVue, {
    // Default theme configuration
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'white',
            cssLayer: false
        }
    }
});

app.use(router);
app.use(ToastService);
app.component('Toast', Toast);
app.component('Button', Button);
app.component('Dialog', Dialog);

app.mount('#app')
