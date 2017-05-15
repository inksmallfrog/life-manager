<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
    <button @click="test">show message</button>
    <userModal v-if="isUserModalShow" :pIsLoggin="userModalState"></userModal>
    <messageBar></messageBar>
  </div>
</template>

<script>
import UserModal from '@/components/UserModal';
import MessageBar from '@/components/MessageBar';

export default {
  name: 'app',
  components: {
    userModal: UserModal,
    messageBar: MessageBar
  },
  computed: {
    isUserModalShow(){
      return this.$store.state.currentModal.name == 'userModal';
    },
    userModalState(){
      return this.$store.state.currentModal.state.isLoggin;
    },
  },
  methods:{
    test(){
      this.$store.dispatch('PUSH_MESSAGE', {
        content: '测试1',
        type: 'info'
      });
    }
  }
};
</script>

<style>
*{
  padding: 0;
  margin: 0;
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
.fade-enter-active,
.fade-leave-active{
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fade-leave-active{
  transform: translateY(-100%);
  opacity: 0;
}
.fade-enter-active{
  transform: translateY(-100%);
  opacity: 0;
}
</style>
