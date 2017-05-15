<template>
  <div class="userModal" @click.prevent.stop="handleModalSpaceClick">
    <div class="box" @click.stop>
      <header class="switcher">
        <button class="leftSwitcher" @click.prevent="isLoggin = true" :class="{active: isLoggin}">
          登陆
          <span class="leftSwitcherArrow" :class="{active: isLoggin}"></span>
        </button>

        <button class="rightSwitcher" @click.prevent="isLoggin = false" :class="{active: !isLoggin}">
          注册
          <span class="rightSwitcherArrow" :class="{active: !isLoggin}"></span>
        </button>
      </header>
      <form action="/users?ask=loggin" id="logginForm" @submit.prevent="loggin" :class="{active: isLoggin}">
        <inputGroup name="email" type="email" placeholder="邮箱" icon="icon-email" v-model="logginEmail" :error="logginEmailError" :input="clearLogginEmailError" :change="handleLogginEmail"></inputGroup>
        <inputGroup name="psd" :type="logginPsdType" placeholder="密码" :icon="logginPsdViewIcon" :iconClick="toggleLogginPsdViewAble" :switchView="true" v-model="logginPsd" :error="logginPsdError" :input="clearLogginPsdError" :change="handleLogginPsd"></inputGroup>
        <button type="submit" class="submitBtn">登陆</button>
      </form>
      <form action="/users?ask=regist" id="registForm" @submit.prevent="regist" :class="{active: !isLoggin}">
        <inputGroup name="email" type="email" placeholder="邮箱" icon="icon-email" v-model="registEmail" :error="registEmailError" :input="clearRegistEmailError" :change="handleRegistEmail"></inputGroup>
        <inputGroup name="psd" :type="registPsdType" placeholder="密码" :icon="registPsdViewIcon" :iconClick="toggleRegistPsdViewAble" :switchView="true" v-model="registPsd" :error="registPsdError" :input="clearRegistPsdError" :change="handleRegistPsd"></inputGroup>
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
    state: Object,
    default: true
  },
  data(){
    return {
      isLoggin: this.state.isLoggin,

      logginEmail: '',
      logginEmailError: '',
      logginPsd: '',
      logginPsdError: '',
      logginPsdType: 'password',

      registEmail: '',
      registEmailError: '',
      registPsd: '',
      registPsdError: '',
      registPsdType: 'password'
    };
  },
  computed: {
    logginPsdViewIcon(){
      return this.logginPsdType == 'password' ? 'icon-unviewable': 'icon-viewable';
    },
    registPsdViewIcon(){
      return this.registPsdType == 'password' ? 'icon-unviewable': 'icon-viewable';
    }
  },
  methods: {
    loggin(e){
      if(this.logginEmailError || this.logginPsdError){
        return;
      }
      else{
        let form = new FormData(e.target);
        this.$store.dispatch('LOGGIN', form)
          .then((json)=>{
            if(json.hasError){
              switch(json.param){
                case 'email':
                  this.logginEmailError = '这个邮箱还没有注册';
                  break;
                case 'psd':
                  this.logginPsdError = '密码错误';
                  break;
                default:
                  break;
              }
            }
            else{
              this.$store.commit('closeModal');
              if(this.state.doJump){
                this.$router.replace(`/${json.user.id}`);
              }
            }
          })
      }
    },
    regist(e){
      if(this.registEmailError || this.registPsdError){
        return;
      }
      else{
        this.$store.dispatch('REGIST', new FormData(e.target))
          .then((json)=>{
            this.$store.commit('closeModal');
            if(this.state.doJump){
              this.$router.replace(`/${json.user.id}`);
            }
          });
      }
    },
    handleLogginEmail(e){
      const email = e.target.value;
      if(!email){
        this.logginEmailError = '';
      }
      else{
        if(!/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(email)){

         this.logginEmailError = '请检查邮箱是否正确';
        }
        else{
          this.logginEmailError = '';
        }
      }
    },
    handleLogginPsd(e){
      const psd = e.target.value;
      if(!psd){
        this.logginPsdError = '';
      }
      else{
        if(psd.length < 6){
          this.logginPsdError = '密码不会少于6位哟';
        }
        else{
          this.logginPsdError = '';
        }
      }
    },
    clearLogginEmailError(e){
      this.logginEmailError = '';
    },
    clearLogginPsdError(e){
      this.logginPsdError = '';
    },
    handleRegistEmail(e){
      const email = e.target.value;
      if(!email){
        this.registEmailError = '';
      }
      else{
        if(!/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(email)){
          this.registEmailError = '请检查邮箱格式是否正确';
        }
        else{
          this.$store.dispatch('CHECK_EMAIL_CONFLICT', email)
            .then((json)=>{
              if(!json.hasError && json.exist){
                this.registEmailError = '这个邮箱已经注册了';
              }else if(!json.hasError && !json.exist){
                this.registEmailError = '';
              }else{
                this.registEmailError = '这个邮箱发生了神奇的错误……请更换邮箱';
              }
            });
        }
      }
    },
    handleRegistPsd(e){
      const psd = e.target.value;
      if(!psd){
        this.registPsdError = '';
      }
      else{
        if(psd.length < 6){
          this.registPsdError = '安全起见，请输入不少于6位的密码';
        }
        else{
          this.registPsdError = '';
        }
      }
    },
    clearRegistEmailError(e){
      this.registEmailError = '';
    },
    clearRegistPsdError(e){
      this.registPsdError = '';
    },
    handleModalSpaceClick(e){
      this.$store.commit('closeModal');
    },
    toggleLogginPsdViewAble(){
      this.logginPsdType = this.logginPsdType == 'password' ? 'text' : 'password';
    },
    toggleRegistPsdViewAble(){
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
