<template>
  <div>
    <div class="control" v-if="!isVisitMode">
      <router-link to="/editPassage/-1">新文章</router-link>
      <button @click="filter=''">全部</button>
      <button @click="filter='script'">已发布</button>
      <button @click="filter='published';">草稿</button>
    </div>
    <ul v-if="passages.length">
      <li v-for="passage in passages">
        <p>{{ passage.Category.title }}</p>
        <p>{{ passage.createdAt }}</p>
        <router-link :to="`/passages/${passage.id}`">{{ passage.title }}</router-link>
        <router-link :to="`/editPassage/${passage.id}`" v-if="!isVisitMode">edit</router-link>
        <button @click="deletePassage(passage.id)" v-if="!isVisitMode">delete</button>
      </li>
    </ul>
    <p v-else>这里空空如也～～</p>
  </div>
</template>

<script>
import router from 'vue-router';

export default {
  name: 'PassageList',
  data(){
    return{
      isVisitMode: true,
      filter: ''
    }
  },
  computed: {
    passages(){
      return this.$store.state.passages.filter((passage)=>{
              return passage.state !== this.filter;
            });
    }
  },
  methods: {
    deletePassage(id){
      this.$store.dispatch('DELETE_PASSAGE', id);
    }
  },
  mounted(){
    const hosterId = this.$route.params.userId,
          customer = this.$store.state.user;
    let userId;
    if(!hosterId){ //self passages page
      if(!customer){ //never login
        this.$router.replace('/');
      }else{
        userId = customer.id;
        this.isVisitMode = false;
      }
    }else if(!customer){ //never login
      userId = hosterId;
      this.isVisitMode = true;
    }else{ // visit others passage
      if(customer.id == hosterId){ //self passages page
        this.$router.replace('/passages');
      }else{
        userId = hosterId;
        this.isVisitMode = true;
      }
    }

    this.$store.dispatch('FETCH_PASSAGECATEGORIES', userId);
    this.$store.dispatch('FETCH_PASSAGES', userId);
  }
}
</script>
