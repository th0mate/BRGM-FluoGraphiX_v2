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
import i18n from './locales/i18n';

import Chart from './assets/js/chart-config';
window.Chart = Chart;

import Aura from '@primeuix/themes/aura';

const app = createApp(App)

app.directive('tooltip', Tooltip);

app.use(PrimeVue, {
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
app.use(i18n);
app.component('Toast', Toast);
app.component('Button', Button);
app.component('Dialog', Dialog);

app.mount('#app')
