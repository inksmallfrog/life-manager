heightclickcli<template>
  <div id="app">
    <unlogged v-if="!host"></unlogged>
    <div v-else>
      <navBar></navBar>
      <transition name="left">
        <router-view class="main"></router-view>
      </transition>
    </div>
    <modalControl v-if="isModalShow"></modalControl>
    <messageBar></messageBar>
  </div>
</template>

<script>
import Unlogged from '@/components/Unlogged';
import NavBar from '@/components/NavBar';
import ModalControl from '@/components/ModalControl'
import MessageBar from '@/components/MessageBar';

export default {
  name: 'app',
  components: {
    unlogged: Unlogged,
    navBar: NavBar,
    modalControl: ModalControl,
    messageBar: MessageBar
  },
  computed: {
    host(){
      return this.$store.state.host || this.$store.state.user;
    },
    isModalShow(){
      return this.$store.state.currentModal.name !== '';
    },
  },
  mounted(){
    //初始化用户登录情况
    this.$store.dispatch('CHECK_LOGGED');
  }
};
</script>

<style>
*{
  padding: 0;
  margin: 0;
}
body{
  overflow-x: hidden;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: #f3f8f1;
  min-height: 100vh;
  height: 100%;
}
.main{
  position: absolute;
  top: 0;
  width: calc(100% - 150px);
  margin-left: 150px;
  background: #ececec;
  min-height: 100vh;
}
.left-enter-active,
.left-leave-active{
  transition: all .5s;
}
.left-leave-active{
  transform: translateX(-100%);
  opacity: 0;
}
.left-enter-active{
  transform: translateX(0);
  opacity: 1;
}
.left-enter{
  transform: translateX(100%);
  opacity: 0;
}
</style>
