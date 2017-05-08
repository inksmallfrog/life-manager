<template>
  <div class="home">
    <img src="" alt="" class="banner">
    <div class="logged" v-if="logged">
      logged
    </div>
    <div class="unlogged" v-else>
      unlogged
      <button @click="showUserModal">登陆</button>
      <userModal v-if="modalShow" v-on:close="closeUserModal"></userModal>
    </div>
  </div>
</template>

<script>
import UserModal from '@/components/UserModal';

export default {
  name: 'home',
  components: {
    userModal: UserModal,
  },
  data(){
    return{
      modalShow: false
    }
  },
  computed: {
    logged(){
      return this.$store.state.user
    }
  },
  methods: {
    showUserModal(e){
      this.modalShow = true;
      e.stopPropagation();
      e.preventDefault();
    },
    closeUserModal(){
      this.modalShow = false;
    }
  },
  beforeCreate(){
    this.$store.dispatch('CHECK_LOGGED');
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
