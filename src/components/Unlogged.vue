<template>
  <div class="unlogged">
      <p>未登录</p>
      <p class="status">你的人生需要来一点管家么？</p>
      <div class="operations">
        <button class="loggin" @click.prevent="showUserModalLog">现在登陆</button>
        <button class="regist" @click.prevent="showUserModalReg">马上注册</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data(){
    return{
      modalShow: false,
      isLoggin: true
    }
  },
  computed: {
    user(){
      const user = this.$store.state.user;
      console.log(user);
      if(user){
        this.$router.replace(`/${user.id}/home`);
      }
    }
  },
  methods: {
    showUserModalLog(e){
      this.$store.commit('showModal', {
        name: 'userModal',
        state: {
          isLoggin: true,
          doJump: true
        }
      });
    },
    showUserModalReg(e){
      this.$store.commit('showModal', {
        name: 'userModal',
        state: {
          isLoggin: false,
          doJump: true
        }
      });
    },
    closeUserModal(){
      this.modalShow = false;
    },
    show(){
      console.log(this.$store);
    }
  },
  watch:{
    '$store': 'show'
  },
  mounted(){
    const user = this.$store.state.user;
    console.log(user);
    if(user){
      this.$router.replace(`/${user.id}/home`);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home{
  min-height: 100vh;
}
figure{
  position: relative;
  width: 100%;
  height: 60vh;
}
img{
  width: 100%;
  height: 100%;
}
figcaption{
  position: absolute;
  display: flex;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(160, 160, 160, 0.6);
}
.text{
  position: relative;
  font-size: 2.5rem;
  color: white;
  margin: auto;
}
.from{
  position: absolute;
  bottom: 30%;
  right: 20%;
  color: white;
}
.itemlist{
  position: relative;
  width: 40%;
  margin: 0 auto;
  margin-top: -2rem;
  display: flex;
  list-style: none;
  margin-bottom: 30px;
}
.item{
  margin: auto;
  overflow-y: hidden;
}
.icon{
  position: relative;
  display: flex;
  width: 4rem;
  height: 4rem;
  border-radius: 100%;
  background: #fff;
  cursor: pointer;
  color: black;
  text-decoration: none;
}
.icon .iconfont{
  font-size: 2rem !important;
  margin: auto;
}
.descript{
  position: relative;
  bottom: -20px;
  transition: bottom .5s;
}
.icon:hover ~ .descript{
  bottom: 0;
}
.status{
  margin-bottom: 30px;
}
.operations{
  display: flex;
  width: 40%;
  margin: auto;
}
.operations button{
  width: 4rem;
  height: 4rem;
  margin: auto;
  border-radius: 100%;
  border: none;
  outline: none;
  cursor: pointer;
}
.unlogged{
  & .status{
    text-align: center;
  }
  & .loggin{
    background: #5c9;
  }
  & .regist{
    background: #f86;
  }
}


.logged{
  & .userInfo{
    display: flex;
    justify-content: center;
    align-content: center;
    width: 100%;
  }
  & .userInfo img{
    border-radius: 100%;
    width: 100px;
    height: 100px;
    margin-right: 100px
  }
  & .userText{
    vertical-align: middle;
  }
  & .userText p:first-child{
    margin-top: 1rem;
  }
}

</style>
