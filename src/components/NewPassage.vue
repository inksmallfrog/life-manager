<template>
  <div class="newPassage">
    <form action="" :class="{withView: viewMode}">
      <header>
        <input name="title" v-model="title" type="text" placeholder="标题">
        <div class="operationsGroup">
          <v-select prefix="分类：" label="title" :value="category" :options="categories" :taggable="true" :onChange="onChange"></v-select>
          <div class="right">
            <button @click="viewMode = !viewMode" type="button"><span class="iconfont icon-picture"></span>上传图片</button>
            <button @click="viewMode = !viewMode" type="button"><span class="iconfont" :class="viewMode?'icon-viewable':'icon-unviewable'"></span>预览</button>
            <button @click="viewMode = !viewMode" type="button"><span class="iconfont icon-save"></span>保存草稿</button>
            <button @click="viewMode = !viewMode" type="submit"><span class="iconfont icon-submit"></span>发布</button>
          </div>
        </div>
      </header>
      <textarea v-model="content"></textarea>
    </form>
    <div class="preview" v-if="viewMode" v-html="markdown"></div>
  </div>
</template>

<script>
import router from 'vue-router';
import select from 'vue-select';
import marked from 'marked';

export default {
  name: 'NewPassage',
  components: {
    'v-select': select
  },
  data(){
    return{
      title: '',
      category: this.$store.state.passageCategories[0],
      content: '',
      viewMode: true
    }
  },
  computed: {
    markdown(){
      return marked(this.content);
    },
    categories(){
      return this.$store.state.passageCategories;
    }
  },
  methods: {
    onChange(value){
      if(!value.id){
        value.id = -1;
      }
      this.category = value;
    }
  },
  beforeCreate(){
    if(!this.$store.state.user){
      this.$router.replace('/');
    }
  }
}
</script>

<style scoped>
  .newPassage{
    display: flex;
    width: 100%;
    height: 100%;
  }
  form{
    width: 80%;
    height: 100%;
    margin: auto;
  }
  form.withView{
    width: 49%;
    margin-right: 1%;
  }
  input{
    width: 100%;
    height: 36px;
  }
  .operationsGroup{

  }
  label{
    display: inline-block;
    line-height: 36px;
    vertical-align: middle;
  }
  .v-select{
    display: inline-block;
    height: 36px;
    width: 50%;
    vertical-align: middle;
  }
  .right{
    height: 36px;
    float: right;
  }
  button{
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    line-height: 36px;
    padding-left: 20px;
    color: blue;
  }
  textarea{
    width: 100% !important;
    height: 100% !important;
    margin-right: 2%;
    resize: none;
  }
</style>
<style type="text/css">
  .preview{
    text-align: left;
    width: 50%;
    padding-left: 1%;
    border-left: #fff 1px solid;
  }
  .preview ol{
    list-style-position: inside;
  }
</style>
