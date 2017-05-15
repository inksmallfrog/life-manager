<template>
    <div class="messageBar" :class="{'show': isMessageShow}">
      <p :class="message.type">{{ message.content }}</p>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'messageBar',
  computed: {
    message(){
      return this.$store.state.globalMessage;
    },
    isMessageShow(){
      return this.$store.state.hasNewMessage;
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
}
</script>

<style scoped>
.messageBar{
  position: fixed;
  height: 50px;
  bottom: -50px;
  transition: bottom .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.messageBar.show{
  bottom: 0;
}
</style>
