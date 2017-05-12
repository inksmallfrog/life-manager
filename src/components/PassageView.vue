<template>
  <div>
    <h1>{{ title }}</h1>
    <p>分类：{{ category }}</p>
    <p v-if="createdAt">发布于：{{ createdAt }}</p>
    <div v-html="markdown"></div>
  </div>
</template>

<script>
import marked from 'marked';

export default {
  name: 'PassageView',
  props: {
    title: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    createdAt: {
      type: String,
      required: false
    },
    content: {
      type: String,
      required: true
    }
  },
  computed: {
    markdown(){
      return marked(this.content);
    }
  }
}
</script>
