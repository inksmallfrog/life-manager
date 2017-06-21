<script>
  /*
   * 个人主页（待修改）
   */
</script>
<template>
  <div class="home">
    <figure>
      <img src="../assets/19.jpg" alt="" class="banner">
      <figcaption>
        <p class="text">「前天是小兔子，昨天是小鹿，今天是你」
          <p class="from">——《Clannad》</p>
        </p>
      </figcaption>
    </figure>
    <div class="logged">
      <div class="userInfo">
        <img :src="user.favicon" alt="">
        <div class="userText">
          <p>{{ user.name }}</p>
          <p>{{ user.des }}</p>
        </div>
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
      return this.$store.state.user
    }
  },
  methods: {
    showUserModalLog(e){
      this.$store.commit('showModal', {
        name: 'userModal',
        state: {
          isLoggin: true
        }
      });
    },
    showUserModalReg(e){
      this.$store.commit('showModal', {
        name: 'userModal',
        state: {
          isLoggin: false
        }
      });
    },
    closeUserModal(){
      this.modalShow = false;
    }
  },
  beforeCreate(){
    this.$store.dispatch('CHECK_LOGGED');
  },
  beforeMount(){
    const user = this.$store.state.user;
    if(!user){
      this.$router.replace('/');
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
.logged{
  position: relative;
  height: 40vh;
  & .userInfo{
    position: absolute;
    top: 50%;
    margin-top: -50px;

    width: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
  }
  & .userInfo img{
    border-radius: 100%;
    width: 100px;
    height: 100px;
    margin-right: 100px
  }
  & .userText{
    vertical-align: middle;
    height: 100px;
  }
  & .userText p:first-child{
    margin-top: 1rem;
    font-size: 2rem;
  }
}

</style>
