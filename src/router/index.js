import Vue from 'vue';
import Router from 'vue-router';
import Unlogged from '@/components/Unlogged';
import Home from '@/components/Home';
import PassageList from '@/components/PassageList';
import Passage from '@/components/Passage';
import PassageEditor from '@/components/PassageEditor';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Home
    },
    {
      path: '/:userid',
      name: 'Home',
      component: Home
    },
    {
      path: '/:userid/passages',
      name: 'PassageList',
      component: PassageList
    },
    {
      path: '/:userid/passages/:passageid',
      name: 'Passage',
      component: Passage
    },
    {
      path: '/editPassage/:id',
      name: 'PassageEditor',
      component: PassageEditor
    }
  ],
});
