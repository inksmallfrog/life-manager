<script>
  /*
   * 文章页面
   */
</script>

<template>
  <div class="passage">
    <passage-view class="article" :title="title" :category="category.title"
        :createdAt="createdAt" :content="content">
    </passage-view>
    <div class="nav">下一篇：<router-link v-if="neighbor.next" :to="`/${host.id}/passages/${neighbor.next.id}`">{{ neighbor.next.title }}</router-link>
    <p v-else>感谢阅读，敬请期待…</p></div>
    <div class="nav">上一篇：<router-link v-if="neighbor.last" :to="`/${host.id}/passages/${neighbor.last.id}`">{{ neighbor.last.title }}</router-link>
    <p v-else>没有上一篇了，感谢阅读</p></div>
    <div class="commentArea">
      <h1>评论</h1>
      <form ref="newComment" :action="`/comments?passageId=${id}`" method="POST" v-if="user">
        <textarea name="content" v-model="newComment" id="" cols="30" rows="10"></textarea>
        <button @click="submitComment" title="发表"><span class="iconfont icon-send"></span>发表</button>
      </form>
      <ul class="commentUl">
        <li v-for="comment in comments">
          <div class="commenterInfo">
            <img :src="comment.User.favicon" alt="">
            <div>
              <p>{{ comment.User.name }}</p>
              <p class="time">{{ comment.createdAt | timeformat }}</p>
            </div>
          </div>
          <p class="comment">
            {{ comment.content }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import router from 'vue-router';
import PassageView from '@/components/PassageView';

export default {
  name: 'Passage',
  components: {
    'passage-view': PassageView
  },
  data(){
    return{
      id: 0,
      title: '加载中…',
      category: {
        title: '未知'
      },
      createdAt: '',
      content: '喝杯咖啡，很快完成～',
      newComment: '',
      comments: []
    }
  },
  filters: {
    dateformat(value) {
      let date = new Date(value);
      return date.Format('YYYY-MM-DD');
    },
    timeformat(value){
      let date = new Date(value);
      return date.Format('YYYY-MM-DD hh:mm:ss');
    }
  },
  computed: {
    host(){
      return this.$store.state.host;
    },
    neighbor(){
      const passages = this.$store.state.passages.filter((passage)=>{
        return passage.state == 'published'
      });
      const currentIndex = passages.findIndex(passage=>passage.id == this.id);
      let neighbor = {
        last: null,
        next: null
      };
      if(currentIndex > 0){
        neighbor.next = passages[currentIndex - 1]
      }
      if(currentIndex < passages.length - 1){
        neighbor.last = passages[currentIndex + 1]
      }
      return neighbor;
    },
    user(){
      return this.$store.state.user;
    }
  },
  watch:{
    '$route' (to, from){
      this.updatePassage();
    }
  },
  methods: {
    submitComment(e){
      e.preventDefault();
      e.stopPropagation();
      let form = new FormData(this.$refs.newComment);
      fetch(`/comments?passageId=${this.id}`, {
        credentials: 'include',
        method: 'POST',
        body: form
      }).then((res)=>{
        //handle error
      });
      this.comments.unshift({
        commenter: this.$store.state.user,
        content: this.newComment,
        User: this.$store.state.user,
        createdAt: new Date()
      });
    },
    updatePassage(){
      //检查被访问的用户id是否改变
      const hostId = this.$route.params.userid;
      if(!this.$store.state.host || hostId != this.$store.state.host.id){
        this.$store.dispatch('VISIT', hostId);
        this.$store.dispatch('FETCH_PASSAGECATEGORIES', hostId);
        this.$store.dispatch('FETCH_PASSAGES', hostId);
      }

      //获取文章
      const passageid = this.$route.params.passageid;
      fetch(`/passages/${passageid}`, {
        method: 'GET'
      }).then((res)=>{
        return res.json();
      }).then((json)=>{
        this.id = json.passage.id;
        this.title = json.passage.title;
        this.category = json.passage.Category;
        this.createdAt = json.passage.createdAt;
        this.content = json.content;
        this.comments = json.passage.Comments;

        if(this.category.User.id != hostId){
          this.$router.replace('/404NotFound');
        }
      });
    }
  },
  mounted(){
    this.updatePassage();
  }
}
</script>

<style scoped>
.article{
  margin-bottom:2rem;
}
.commentArea{
  padding-bottom: 2rem;
}
.commentArea h1{
  border-bottom: 1px #666 solid;
  margin: 1rem 0;
}
.commentArea textarea{
  width: 60%;
  height: 100px;
  padding: .5rem;
  font-size: 1.2rem;
  resize: none;
  vertical-align: bottom;
}
.commentArea button{
  padding: 3px 7px;
  cursor: pointer;
  background: #6c4;
  border: none;
  vertical-align: bottom;
}
.commentUl{
  margin-top: 2rem;
  list-style: none;
}
.commentUl li{
  border-bottom: #666 1px solid;
  margin-bottom: 2rem;
  & .commenterInfo{
    display: flex;
    margin-bottom: 1rem;
    & img{
      border-radius: 100%;
      width: 50px;
      height: 50px;
    }
    & div{
      height: 50px;
      & p{
        line-height: 25px;
        margin-left: 1rem;
      }
      & .time{
        color: #666;
        font-size: 0.8rem;
      }
    }
  }
  & .comment{
    margin-left: calc(1rem + 50px);
    padding-bottom: 1rem;
  }
}


</style>
