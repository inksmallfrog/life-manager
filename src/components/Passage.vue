<template>
  <div class="passage">
    <passage-view class="article" :title="title" :category="category.title"
        :createdAt="createdAt" :content="content">
    </passage-view>
    <router-link v-if="neighbor.next" :to="`passages/${neighbor.next.id}`">{{ neighbor.next.title }}</router-link>
    <p v-else>感谢阅读，敬请期待…</p>
    <router-link v-if="neighbor.last" :to="`passages/${neighbor.last.id}`">{{ neighbor.last.title }}</router-link>
    <p v-else>没有上一篇了，感谢阅读</p>
    <div class="commentArea">
      <h1>评论</h1>
      <form ref="newComment" :action="`/comments?passageId=${id}`" method="POST" v-if="user">
        <textarea name="content" v-model="newComment" id="" cols="30" rows="10"></textarea>
        <button @click="submitComment">提交</button>
      </form>
      <ul class="commentUl">
        <li v-for="comment in comments">
          <div class="commenterInfo">
            <img :src="comment.User.favicon" alt="">
            <p>{{ comment.User.name }}</p>
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
      title: '',
      category: {
        title: '加载中…'
      },
      createdAt: '',
      content: '',
      newComment: '',
      comments: []
    }
  },
  computed: {
    neighbor(){
      const passages = this.$store.state.passages;
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
        User: this.$store.state.user
      });
    }
  },
  mounted(){
    console.log(this.$route.params.id);
    const id = this.$route.params.id;
    fetch(`/passages/${id}`, {
      method: 'GET'
    }).then((res)=>{
      return res.json();
    }).then((json)=>{
      this.id = json.passage.id,
      this.title = json.passage.title,
      this.category = json.passage.Category,
      this.createdAt = json.passage.createdAt,
      this.content = json.content,
      this.comments = json.passage.Comments
    });
  }
}
</script>

<style scoped>
.passage{
  margin: 0 10%;
}
.article{
  margin-bottom:2rem;
}
.commentArea{
  padding-bottom: 2rem;
}
.commentArea h1{
  border-bottom: 1px #666 solid;
  margin: 2rem 0;
}
.commentArea textarea{
  width: 80%;
  height: 200px;
  padding: .5rem;
  font-size: 1.2rem;
  resize: none;
  display: block;
}
.commentUl{
  list-style: none;
}
.commentUl li{
  border-bottom: #666 1px solid;
}
.commenterInfo{
  display: flex;
}
.commenterInfo img{
  border-radius: 100%;
  width: 50px;
  height: 50px;
}
.commenterInfo p{
  line-height: 50px;
  margin-left: 2rem;
}
.comment{
  margin-left: calc(2rem + 50px);
  padding-bottom: 1rem;
}
</style>
