<template>
  <div class="passageList">
    <button class="newPassage"><router-link to="/editPassage/-1">+<span class="iconfont icon-newPassage">新文章</span></router-link></button>
    <div class="stateFilter" v-if="!isVisitMode">
      文章状态:
      <a :class="{selected: filter==''}" href="#" @click.prevent="filter=''">全部</a>
      <a :class="{selected: filter=='published'}" href="#" @click.prevent="filter='published'">已发布</a>
      <a :class="{selected: filter=='script'}" href="#" @click.prevent="filter='script';">草稿</a>
    </div>
    <div v-if="passagesParsed.length" class="passages">
      <div v-for="yearPassages in passagesParsed">
      <h1>{{ yearPassages.year }}年({{yearPassages.passages.length}}篇)</h1>
        <ul>
          <li v-for="passage in yearPassages.passages">
            <p class="category">{{ passage.Category.title }}</p>
            <p class="date">{{ passage.createdAt | dateformat }}</p>
            <router-link :to="`/${host.id}/passages/${passage.id}`" class="link">{{ passage.title }}</router-link>
            <button title="编辑" class="edit"><router-link :to="`/editPassage/${passage.id}`" v-if="!isVisitMode" ><span class="iconfont icon-edit"></span></router-link></button>
            <button @click="deletePassage(passage.id)" v-if="!isVisitMode" title="删除" class="delete"><span class="iconfont icon-delete"></span></button>
          </li>
        </ul>
      </div>
    </div>
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
    host(){
      return this.$store.state.host;
    },
    passagesParsed(){
      const passages = this.$store.state.passages;
      let parsed = [];
      let yearPos = {};   //记录年份在parsed中的位置
      for(let passage of passages){
        if(!this.filter || this.filter == passage.state){ //文章类型过滤器
          let date = new Date(passage.createdAt),
              year = date.getFullYear();
          if(typeof yearPos[year] == 'undefined'){ //如果该年份没有记录
            parsed.push({
              year: year,
              passages: []
            });
            yearPos[year] = parsed.length - 1;
          }
          let yearPassages = parsed[yearPos[year]].passages;
          yearPassages.push(passage);
        }
      }
      return parsed;
    }
  },
  filters: {
    dateformat(value) {
      let date = new Date(value);
      return date.Format('YYYY-MM-DD');
    },
    passageTypeFilter(value){
      if(this.filter){
        return value.filter((passage)=>{
                 return passage.state === this.filter;
               });
      }
      else{
        return value;
      }
    }
  },
  watch:{
    '$route'(to, from){
      this.checkHostChange();
    }
  },
  methods: {
    deletePassage(id){
      this.$store.dispatch('DELETE_PASSAGE', id);
    },
    checkHostChange(){
      const hostId = this.$route.params.userid,
            customer = this.$store.state.user;
      //检查被访问的用户id是否改变
      if(!this.$store.state.host || hostId != this.$store.state.host.id){
        this.$store.dispatch('VISIT', hostId);
        this.$store.dispatch('FETCH_PASSAGECATEGORIES', hostId);
        this.$store.dispatch('FETCH_PASSAGES', hostId);
      }
      if(customer && hostId == customer.id){ //访问自己的文章页
        this.isVisitMode = false;
      }
    }
  },
  mounted(){
    this.checkHostChange();
  }
}
</script>

<style scoped>
.passageList{
  padding: 20px;
}
.newPassage{
  cursor: pointer;
  outline: none;
  border: none;
  background-color: #6c4;
  padding: 3px 7px;
  & a{
    text-decoration: none;
    color: black;
  }
}
.stateFilter{
  margin-left: 20px;
  display: inline-block;
  & a{
    text-decoration: none;
    color: inherit;
  }
  & .selected{
    color: #666;
    cursor: default;
    pointer-events: none;
  }
}
.passages{
  & h1{
    border-bottom: #666 1px solid;
    margin-bottom: 10px;
  }
  & ul{
    list-style: none;
  }
  & li{
    display: flex;
    align-content: center;
    & p{
      line-height: 30px;
      &.category,
      &.date{
        margin-right: 10px;
      }
    }
    & .link{
      line-height: 30px;
      margin-right: 20px
    }
    & button{
      line-height: 30px;
      background: none;
      border: none;
      margin-right: 10px;
      cursor: pointer;
      & a{
        text-decoration: none;
        color: black;
      }
    }
  }
}
</style>
