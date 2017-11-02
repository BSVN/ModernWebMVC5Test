// the Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '@/assets/bootstrap/css/bootstrap.rtl.min.css';
import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

const vueApp: Vue = new Vue({
  el: '#app',
  render: (h) => h(App, {}),
  router,
});
