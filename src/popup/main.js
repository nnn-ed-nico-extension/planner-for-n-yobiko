import Vue from 'vue';
import App from './App.vue';
import { faCheckCircle, faDonate } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

library.add(faCheckCircle, faGithub, faDonate);

Vue.component('fa', FontAwesomeIcon)

/* eslint-disable no-new */
new Vue({
	el: '#app',
	render: h => h(App)
});
