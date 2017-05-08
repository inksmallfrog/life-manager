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
    <ul class="itemlist">
        <li class="item">
          <div class="icon">
            <span class="iconfont icon-passage"></span>
          </div>
          <div class="descript">心情日记</div>
        </li>
        <li class="item">
          <div class="icon">
            <span class="iconfont icon-todo"></span>
          </div>
          <div class="descript">人生计划</div>
        </li>
        <li class="item">
          <div class="icon">
            <span class="iconfont icon-more"></span>
          </div>
          <div class="descript">更多期待</div>
        </li>
      </ul>
    <div class="logged" v-if="logged">
      logged
    </div>
    <div class="unlogged" v-else>
      <p class="status">您还没有登陆</p>
      <div class="operations">
        <button class="loggin" @click="showUserModalLog">现在登陆</button>
        <button class="regist" @click="showUserModalReg">马上注册</button>
      </div>
      <userModal v-if="modalShow" v-on:close="closeUserModal" :pIsLoggin="isLoggin"></userModal>
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
      modalShow: false,
      isLoggin: true
    }
  },
  computed: {
    logged(){
      return this.$store.state.user
    }
  },
  methods: {
    showUserModalLog(e){
      this.isLoggin = true;
      this.modalShow = true;
      e.stopPropagation();
      e.preventDefault();
    },
    showUserModalReg(e){
      this.isLoggin = false;
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
.home{
  height: 100%;
}
figure{
  position: relative;
  width: 100%;
  height: 60%;
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
  background: #eee;
  cursor: pointer;
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
.loggin{
  background: #5c9;
}
.regist{
  background: #f86;
}
</style>
