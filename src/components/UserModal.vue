<template>
  <div class="userModal" @click="modalSpaceClick">
    <div class="box" @click="boxClick">
      <header class="switcher">
        <button class="leftSwitcher" @click="toLoggin" :class="{active: isLoggin}">
          登陆
          <span class="leftSwitcherArrow" :class="{active: isLoggin}"></span>
        </button>

        <button class="rightSwitcher" @click="toRegist" :class="{active: !isLoggin}">
          注册
          <span class="rightSwitcherArrow" :class="{active: !isLoggin}"></span>
        </button>
      </header>
      <form id="logginForm" @submit="loggin" :class="{active: isLoggin}">
        <inputGroup name="email" placeholder="邮箱" v-model="logginEmail" :error="logginEmailError" :change="handleLogginEmail"></inputGroup>
        <inputGroup name="psd" placeholder="密码" v-model="logginPsd" :error="logginPsdError" :change="handleLogginPsd"></inputGroup>
        <button type="submit">登陆</button>
      </form>
      <form id="registForm" @submit="regist" :class="{active: !isLoggin}">
        <inputGroup name="email" placeholder="邮箱" v-model="registEmail" :error="registEmailError" :change="handleRegistEmail"></inputGroup>
        <inputGroup name="psd" placeholder="密码" v-model="registPsd" :error="registPsdError" :change="handleRegistPsd"></inputGroup>
        <button type="submit">注册</button>
      </form>
    </div>
  </div>
</template>

<script>
import InputGroup from '@/components/InputGroup';
export default {
  name: 'userModal',
  components: {
    inputGroup: InputGroup
  },
  data(){
    return {
      isLoggin: true,
      logginEmail: '',
      logginPsd: '',
      registEmail: '',
      registPsd: ''
    };
  },
  computed: {
    logginEmailError(){
      return this.$store.state.logginEmailError;
    },
    logginPsdError(){
      return this.$store.state.logginPsdError;
    },
    registEmailError(){
      return this.$store.state.registEmailError;
    },
    registPsdError(){
      return this.$store.state.registPsdError;
    }
  },
  methods: {
    modalSpaceClick(e){
      this.$emit('close');
      e.stopPropagation();
      e.preventDefault();
    },
    boxClick(e){
      e.stopPropagation();
      e.preventDefault();
    },
    toLoggin(e){
      this.isLoggin = true;
    },
    toRegist(e){
      this.isLoggin = false;
    },
    loggin(e){
      if(this.logginEmailError()){
//        document.getElementById('logginEmail').focus();
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      if(this.logginPsdError()){
//        document.getElementById('logginPsd').focus();
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      else{
        let form = new FormData(e.target);
        this.$store.dispatch('LOGGIN', form);
        e.stopPropagation();
        e.preventDefault();
      }
    },
    regist(e){
      if(this.registEmailError()){
        //document.getElementById('registEmail').focus();
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      if(this.registPsdError()){
        //document.getElementById('registPsd').focus();
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      else{
        let form = new FormData(e.target);
        this.$store.dispatch('REGISTER', form);
        e.stopPropagation();
        e.preventDefault();
      }
    },
    handleLogginEmail(e){
      const email = e.target.value;
      if(!email){
        this.$store.commit('setLogginEmailError', '');
      }
      else{
        if(!/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(email)){
          this.$store.commit('setLogginEmailError', '请检查邮箱是否正确');
        }
        else{
          this.$store.commit('setLogginEmailError', '');
        }
      }
    },
    handleLogginPsd(e){
      const psd = e.target.value;
      if(!psd){
        this.$store.commit('setLogginPsdError', '');
      }
      else{
        if(psd.length < 6){
          this.$store.commit('setLogginPsdError', '密码不会少于6位哟');
        }
        else{
          this.$store.commit('setLogginPsdError', '');
        }
      }
    },
    handleRegistEmail(e){
      const email = e.target.value;
      if(!email){
        this.$store.commit('setRegistEmailError', '');
      }
      else{
        if(!/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(email)){
          this.$store.commit('setRegistEmailError', '请检查邮箱是否正确');
        }
        else{
          this.$store.dispatch('CHECK_EMAIL_CONFLICT', email);
        }
      }
    },
    handleRegistPsd(e){
      const psd = e.target.value;
      if(!psd){
        this.$store.commit('setRegistPsdError', '');
      }
      else{
        if(psd.length < 6){
          this.$store.commit('setRegistPsdError', '为了保证您的帐号安全，请输入不少于6位的密码');
        }
        else{
          this.$store.commit('setRegistPsdError', '');
        }
      }
    }
  }
};
</script>

<style scoped>
  .userModal{
    position: fixed;
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(128, 128, 128, 0.5);
  }
  .box{
    position: relative;

    margin: auto;
    width: 40%;
    height: 40%;
    min-height: 300px;
    background: white;
    border-radius: 2px;
    overflow-x: hidden;
  }
  header{
    margin-bottom: 20px;
  }
  .switcher{
    position: relative;
    background: green;
  }
  .switcher button{
    position: absolute;
    width: 20%;
    background: #eee;
    border: none;
    outline: none;
    cursor: pointer;
    transition: width .5s, color .5s;
  }
  .leftSwitcher{
    left: 0;
  }
  .rightSwitcher{
    right: 0;
  }
  .leftSwitcher.active,
  .rightSwitcher.active{
    width: 80%;
    background: red;
  }
  .leftSwitcherArrow.active{
    right: -20px;
    border-top: transparent 10px solid;
    border-bottom: transparent 10px solid;
    border-left: red 10px solid;
    border-right: transparent 10px solid;
  }
  .rightSwitcherArrow.active{
    left: -20px;
    border-top: transparent 10px solid;
    border-bottom: transparent 10px solid;
    border-left: transparent 10px solid;
    border-right: red 10px solid;
  }
  .leftSwitcherArrow,
  .rightSwitcherArrow{
    position: absolute;
    z-index: 10;
    border-top: transparent 10px solid;
    border-bottom: transparent 10px solid;
    border-left: #eee 0px solid;
    border-right: #eee 0px solid;
    transition: right .5s, left .5s;
  }
  form{
    position: absolute;
    width: 100%;
    text-align: center;
    transition: left .5s, right .5s;
  }
  #logginForm{
    left: -100%;
  }
  .active#logginForm{
    left: 0;
  }
  #registForm{
    right: -100%;
  }
  .active#registForm{
    right: 0;
  }
</style>
