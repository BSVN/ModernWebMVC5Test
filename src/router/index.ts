import HelloWorld from '@/components/HelloWorld.vue';
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      component: HelloWorld,
      path: '/',
    },
  ],
});
