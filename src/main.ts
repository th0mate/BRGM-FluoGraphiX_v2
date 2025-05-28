import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";

// Utilisation de l'import direct du thème Aura en mode light
import Aura from '@primeuix/themes/aura';

const app = createApp(App)

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

app.mount('#app')
