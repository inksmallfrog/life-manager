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
      <form action="/users?ask=loggin" id="logginForm" @submit.prevent="loggin" :class="{active: isLoggin}">
        <inputGroup name="email" type="email" placeholder="邮箱" icon="icon-email" v-model="logginEmail" :error="logginEmailError":input="clearLogginEmailError" :change="handleLogginEmail"></inputGroup>
        <inputGroup name="psd" :type="logginPsdType" placeholder="密码" :icon="logginView" :iconClick="toggleLogginView" :switchView="true" v-model="logginPsd" :error="logginPsdError" :input="clearLogginPsdError" :change="handleLogginPsd"></inputGroup>
        <button type="submit" class="submitBtn">登陆</button>
      </form>
      <form action="/users?ask=regist" id="registForm" @submit.prevent="regist" :class="{active: !isLoggin}">
        <inputGroup name="email" type="email" placeholder="邮箱" icon="icon-email" v-model="registEmail" :error="registEmailError" :input="clearRegistEmailError" :change="handleRegistEmail"></inputGroup>
        <inputGroup name="psd" :type="registPsdType" placeholder="密码" :icon="registView" :iconClick="toggleRegistView" :switchView="true" v-model="registPsd" :error="registPsdError" :input="clearRegistPsdError" :change="handleRegistPsd"></inputGroup>
        <button type="submit" class="submitBtn">注册</button>
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
  props:{
    pIsLoggin: Boolean,
    default: true
  },
  data(){
    return {
      isLoggin: this.pIsLoggin,
      logginEmail: '',
      logginPsd: '',
      registEmail: '',
      registPsd: '',
      logginPsdType: 'password',
      registPsdType: 'password'
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
    },
    logginView(){
      return this.logginPsdType == 'password' ? 'icon-unviewable': 'icon-viewable';
    },
    registView(){
      return this.registPsdType == 'password' ? 'icon-unviewable': 'icon-viewable';
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
    },
    toLoggin(e){
      this.isLoggin = true;
    },
    toRegist(e){
      this.isLoggin = false;
    },
    loggin(e){
      if(this.logginEmailError){
//        document.getElementById('logginEmail').focus();
        return;
      }
      if(this.logginPsdError){
//        document.getElementById('logginPsd').focus();
        return;
      }
      else{
        let form = new FormData(e.target);
        this.$store.dispatch('LOGGIN', form);
      }
    },
    regist(e){
      console.log('sss');
      if(this.registEmailError){
        //document.getElementById('registEmail').focus();
        return;
      }
      if(this.registPsdError){
        //document.getElementById('registPsd').focus();
        return;
      }
      else{
        let form = new FormData(e.target);
        this.$store.dispatch('REGISTER', form);
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
    clearLogginEmailError(e){
      this.$store.commit('setLogginEmailError', '');
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
    clearLogginPsdError(e){
      this.$store.commit('setLogginPsdError', '');
    },
    handleRegistEmail(e){
      const email = e.target.value;
      if(!email){
        this.$store.commit('setRegistEmailError', '');
      }
      else{
        if(!/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(email)){
          this.$store.commit('setRegistEmailError', '请检查邮箱格式是否正确');
        }
        else{
          this.$store.dispatch('CHECK_EMAIL_CONFLICT', email);
        }
      }
    },
    clearRegistEmailError(e){
      this.$store.commit('setRegistEmailError', '')
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
    },
    clearRegistPsdError(e){
      this.$store.commit('setRegistPsdError', '');
    },
    toggleLogginView(){
      this.logginPsdType = this.logginPsdType == 'password' ? 'text' : 'password';
    },
    toggleRegistView(){
      this.registPsdType = this.registPsdType == 'password' ? 'text' : 'password';
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
    height: 350px;
    background: white;
    border-radius: 2px;
    overflow-x: hidden;
  }
  header{
    margin-bottom: 25px;
    height: 90px;
  }
  .switcher{
    position: relative;
    background: green;
  }
  .switcher button{
    position: absolute;
    font-size: 1.8rem;
    width: 30%;
    height: 100%;
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
    width: 70%;
    background: red;
    color: white;
  }
  .leftSwitcherArrow.active{
    top: 0;
    right: -90px;
    border-top: transparent 45px solid;
    border-bottom: transparent 45px solid;
    border-left: red 45px solid;
    border-right: transparent 45px solid;
  }
  .rightSwitcherArrow.active{
    top: 0;
    left: -90px;
    border-top: transparent 45px solid;
    border-bottom: transparent 45px solid;
    border-right: red 45px solid;
    border-left: transparent 45px solid;
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
    pointer-events: none;
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
  .submitBtn{
    margin-top: 20px;
    cursor: pointer;
    padding: 5px 30px;
    font-size: 1.5rem;
    background: #ddd;
    border: none;
    outline: none;
  }
</style>
