import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import PassageList from '@/components/PassageList';
import Passage from '@/components/Passage';
import PassageEditor from '@/components/PassageEditor';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/passages',
      name: 'SelfPassageList',
      component: PassageList
    },
    {
      path: '/passages/:id',
      name: 'Passage',
      component: Passage
    },
    {
      path: '/userPassages/:userId',
      name: 'UserPassageList',
      component: PassageList
    },
    {
      path: '/editPassage/:id',
      name: 'PassageEditor',
      component: PassageEditor
    }
  ],
});
