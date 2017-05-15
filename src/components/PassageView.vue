<template>
  <div @scroll="scroll" class="passageView">
    <h1 class="title">{{ title ? title : '无题' }}</h1>
    <div class="metaBox">
      <p class="meta">分类：{{ category }}</p>
      <p v-if="createdAt" class="meta">发布于：{{ createdAt.substring(0, 10) }}</p>
    </div>
    <article v-html="markdown" class="markdown"></article>
  </div>
</template>

<script>
import marked from 'marked';
marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});

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
    },
    scroll:{
      type: Function,
      required: false,
      default: ()=>{
        return function(e){console.log(e)};
      }
    }
  },
  computed: {
    markdown(){
      return marked(this.content);
    }
  }
}
</script>

<style>
@import '../styles/_variables.css';
.passageView{
  margin-right: 2rem;
}

.title{
  text-align: center;
  font-size: 2.5rem;
}
.metaBox{
  display: flex;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
}
.meta:first-child{
  margin-right: 4rem;
}
.meta:last-child{
  margin-right: 0;
}
.markdown{
  & h1{
    font-size: 2.5rem;
    border-bottom: var(--borderColor) 1px solid;
    margin: 0;
    margin-bottom: .5em;
  }
  & h2{
    font-size: 1.8rem;
    margin: 1em 0 .5em 0;
  }
  & h3{
    font-size: 1.3rem;
    margin: .8em 0 .5em 0;
    text-indent: 2rem;
  }
  & h4{
    font-size: 1rem;
    margin: .5em 0 .3em 0;
    text-indent: 2rem;
  }
  & img{
    width: calc(100% - 2em);
  }
  & > p{
    text-indent: 2em;
  }
  & ol,
  & ul{
    list-style-position: inside;
    padding: 0;
    margin-left: 2em;
    font-size: 1.2rem;
  }
  & ol pre,
  & ul pre{
    margin-left: 0;
  }
  & pre{
    margin: .5em 0 .5em 2rem;
    background-color: #222;
    color: white;
    padding: 1em;
    line-height: 1.5em;
    border-radius: 4px;
    font-size: 1.2rem;
  }
  & blockquote{
    background: #f3f3f3;
    padding: 1em;
    border-left: .4em #555 solid;
  }
  & blockquote p{
    margin: 0;
  }
}
</style>
