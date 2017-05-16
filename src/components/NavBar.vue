<template>
  <div class="navBar">
    <header class="userInfo">
      <figure>
        <img :src="user.favicon" alt="">
      </figure>
      <div>
        <p class="name">{{ user.name }}</p>
        <p class="des">{{ user.des }}</p>
      </div>
    </header>
    <ul class="pages">
      <li><router-link :to="`/${user.id}`">主页</router-link></li>
      <li><router-link :to="`/${user.id}/passages`">文章</router-link></li>
      <li v-if="isSelfPage"><router-link :to="`/${user.id}/todo`">计划</router-link></li>
    </ul>
  </div>
</template>

<script>


export default {
  name: 'navBar',
  computed: {
    user(){
      //如果访问他人页面，显示主人信息，否则显示个人信息
      return this.$store.state.host || this.$store.state.user
    },
    isSelfPage(){
      return this.$store.state.host == this.$store.state.user;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navBar{
  position: fixed;
  left: 0;

  box-sizing: border-box;

  width: 150px;
  height: 100%;
  background: transparent;
  z-index: 101;
  padding: 20px;

  background: #f3f8f1;
}
.userInfo{
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px #666 solid;
  margin-bottom: 20px;

  & img{
    border-radius: 100%;
    width: 50%;
    margin-bottom: 5px;
  }
  & .name{
    font-size: 1.2rem;
  }
  & .des{
    font-size: .8rem;
  }
}
ul{
  text-align: right;
  list-style: none;
}
</style>
