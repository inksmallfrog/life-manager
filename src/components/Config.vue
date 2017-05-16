<template>
  <div class="config">
    <form action="">
      <input type="text" placeholder="用户名" v-model="userName">
      <input type="text" placeholder="描述" v-model="description">
    </form>
  </div>
</template>

<script>
import router from 'vue-router';
import PassageView from '@/components/PassageView';

export default {
  name: 'Config',
  data(){
    return{
      userName: '',
      description: '',
    }
  },
  mounted(){
    if(!this.$store.state.user){
      this.$router.replace('/404NotFound');
    }else{
      const user = this.$store.state.user;
      this.userName = user.name;
      this.description = user.des;
    }
  }
}
</script>

<style scoped>

</style>
