<template>
  <div>
    <router-link to="/new/passage">新文章</router-link>
    <button>全部</button>
    <button>已发布</button>
    <button>草稿</button>
    <ul v-if="passages.length">
      <li v-for="passage in passages">
        <p>{{ passage.category.title }}</p>
        <p>{{ passage.createdAt }}</p>
        <router-link :to="passage.src">{{ passage.title }}</router-link>
      </li>
    </ul>
    <p v-else>您还没有写过日记呢～</p>
  </div>
</template>

<script>
import router from 'vue-router';

export default {
  name: 'Passage',
  computed: {
    passages(){
      return this.$store.state.passages;
    }
  },
  beforeCreate(){
    if(!this.$store.state.user){
      this.$router.replace('/');
    }
    this.$store.dispatch('FETCH_PASSAGECATEGORIES');
    this.$store.dispatch('FETCH_PASSAGES');
  }
}
</script>
