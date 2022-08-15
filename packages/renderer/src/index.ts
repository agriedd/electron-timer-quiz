import {createApp} from 'vue';
import store from '../../states';
import App from '/@/App.vue';

declare global {
	interface Window {
		electronAPI: any;
	}
}

const app = createApp(App);
app.use(store);
app.mount('#app');
