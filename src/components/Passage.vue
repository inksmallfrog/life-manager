<template>
  <div class="passage">
    <passage-view :title="title", :category="category.title",
        :createdAt="createdAt" :content="content">
    </passage-view>
    <p>评论</p>
    <form  ref="newComment" :action="`/comments?passageId=${id}`" method="POST">
      <textarea name="content" v-model="newComment" id="" cols="30" rows="10"></textarea>
      <button @click="submitComment">提交</button>
    </form>
    <ul>
      <li v-for="comment in comments">
        {{ comment.content }}
      </li>
    </ul>
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
        content: this.newComment
      });
    }
  },
  mounted(){
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

</style>
