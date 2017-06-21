<script>
  /*
   * 个人信息配置页面（待完善）
   */
</script>

<template>
  <div class="config">
    <h1>个人设置</h1>
    <form action="" @submit.prevent.stop="handleSubmit">
      <InputGroup type="text" placeholder="用户名" v-model="userName" name="name" :change="handleName" icon="icon-username" :error="userNameErr"></InputGroup>
      <InputGroup type="textarea" placeholder="自我描述" v-model="description" name="des" icon="icon-userdes"></InputGroup>
      <input class="hide" type="text" :value="faviconSrc" name="favicon">
      <div class="faviconGroup">
        <button @click.prevent="configFavicon">设置头像</button>
        <img :src="faviconSrc" alt="">
      </div>
      <button type="submit" class="submitBtn">确认</button>
    </form>
  </div>
</template>

<script>
import router from 'vue-router';
import InputGroup from '@/components/InputGroup';
import PictureEditor from '@/components/PictureEditor';

export default {
  name: 'Config',
  components: {
    InputGroup: InputGroup,
    pictureEditor: PictureEditor
  },
  data(){
    return{
      userName: '',
      userNameErr: '',
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
    },
    checkUserName(name){
      if(name == ''){
        this.userNameErr = '用户名不能为空';
        return false;
      }else{
        this.userNameErr = '';
        return true;
      }
    },
    handleName(e){
      this.checkUserName(e.target.value);
    },
    handleSubmit(e){
      this.checkUserName(e.target.value);
      if(!this.userNameErr){
        const data = new FormData(e.target);
        this.$store.dispatch('UPDATE_USER', data)
          .then((res)=>{
            this.$router.replace('/');
          })
      }
    }
  },
  watch:{
    '$store.state.curremtModal'(to, from){
      console.log(to + ' ' + from);
    }
  },
  beforeCreate(){
    this.$store.dispatch('CHECK_LOGGED');
  },
  mounted(){
    if(!this.$store.state.user){
      this.$router.replace('/404NotFound');
    }
  }
}
</script>

<style scoped>
.config{
  box-sizing: border-box;
  padding: 0 40px 0 20px;
}
h1{
  margin-bottom: 2rem;
  border-bottom: 1px #666 solid;
  text-align: center;
}
form{
  text-align: center;
}
.faviconGroup{
  width: 40%;
  margin: 0 auto;
  text-align: left;

  & button{
    vertical-align: middle;
    background: #6c4;
    padding: 3px 7px;
    cursor: pointer;
    border: none;
    margin-right: 2rem;
  }
  & img{
    border-radius: 100%;
    width: 60px;
    vertical-align: middle;
  }
}
.submitBtn{
  background: #aaa;
  padding: 3px 7px;
  cursor: pointer;
  border: none;
  margin-top: 2rem;
}
.hide{
  display: none;
}
</style>
