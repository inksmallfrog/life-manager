<template>
  <div class="config">
    <form action="">
      <input type="text" placeholder="用户名" v-model="userName" name="name">
      <input type="text" placeholder="描述" v-model="description" name="des">
      <input class="hide" type="text" :value="faviconSrc" name="favicon">
      <button @click.prevent="configFavicon">设置头像</button>
    </form>
    <img :src="faviconSrc" alt="">
  </div>
</template>

<script>
import router from 'vue-router';
import PictureEditor from '@/components/PictureEditor';

export default {
  name: 'Config',
  components: {
    pictureEditor: PictureEditor
  },
  data(){
    return{
      userName: '',
      description: '',
    }
  },
  computed: {
    faviconSrc(){
      return this.$store.state.lastFavicon ? this.$store.state.lastFavicon : this.$store.state.user.favicon;
    }
  },
  methods: {
    configFavicon(){
       this.$store.commit('showModal', {
        name: 'pictureEditor',
        state: {
          isCircle: true
        }
      });
    }
  },
  watch:{
    '$store.state.curremtModal'(to, from){
      console.log(to + ' ' + from);
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
img{
  border-radius: 100%;
  width: 120px;
}
.hide{
  display: none;
}
</style>
