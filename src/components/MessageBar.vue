<template>
  <transition name="up">
    <div class="messageBar" :class="message.type" v-if="isMessageShow">
      <p>{{ message.content }}</p><a @click.prevent="doOperation" v-if="message.operation">{{ message.operation.text }}</a>
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
    doOperation(){
      this.$store.state.globalMessage.operation.do();
    }
  },
}
</script>

<style scoped>
.messageBar.up-leave-active{
  bottom: -43px;
}

.messageBar{
  position: fixed;
  left: 10%;
  bottom: -3px;

  box-sizing: border-box;

  width: 80%;
  height: 43px;

  padding: 6px 20px 9px 20px;

  border-radius: 3px;

  transition: bottom .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.messageBar.info{
  background: rgba(128, 244, 137, 0.6);
}
.messageBar.error{
  background: rgba(244, 128, 137, 0.6);
}
p{
  display: inline-block;
}
a{
  cursor: pointer;
}
</style>
