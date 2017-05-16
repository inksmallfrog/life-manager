import Vue from 'vue';
import Router from 'vue-router';
import Unlogged from '@/components/Unlogged';
import Home from '@/components/Home';
import PassageList from '@/components/PassageList';
import Passage from '@/components/Passage';
import PassageEditor from '@/components/PassageEditor';
import NotFound from '@/components/NotFound';
import Config from '@/components/Config';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Home
    },
    {
      path: '/404NotFound',
      name: '404',
      component: NotFound
    },
    {
      path: '/config',
      name: 'Config',
      component: Config
    },
    {
      path: '/editPassage/:id',
      name: 'PassageEditor',
      component: PassageEditor
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
  ],
});
