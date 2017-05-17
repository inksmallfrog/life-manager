<script>
  /*
   * 编辑文章页面
   */
</script>

<template>
  <div class="newPassage">
    <form action="/passages" method="POST" :class="{withView: viewMode}"
        @submit="handleSubmit"
        @keypress="noSubmit">
      <input name="title" v-model="title" type="text" placeholder="标题">
      <div class="operationsGroup">
        <v-select prefix="分类：" label="title" :value="category" :options="categories" :taggable="true" :onChange="onChange"></v-select>
        <div class="right">
          <button @click="openPicModal" type="button"><span class="iconfont icon-picture"></span>添加图片</button>
          <button @click="viewMode = !viewMode" type="button"><span class="iconfont" :class="viewMode?'icon-viewable':'icon-unviewable'"></span>预览</button>
          <button @click="saveScript" type="button"><span class="iconfont icon-save"></span>保存草稿</button>
          <button @click="publish" type="submit"><span class="iconfont icon-submit"></span>发布</button>
        </div>
      </div>
      <textarea v-model="content" ref="editor" @blur="saveEditorPos" @drop="dropPics" @scroll="scroll"></textarea>
    </form>
    <passage-view ref="preview" class="preview" v-if="viewMode" :title="title" :category="category.title" :content="content" :scroll="scroll"></passage-view>
    <picture-modal v-if="picUpload" v-on:close="closeModal"></picture-modal>
  </div>
</template>

<script>
import router from 'vue-router';
import select from 'vue-select';
import PassageView from '@/components/PassageView';
import pictureModal from '@/components/PictureModal';
import marked from 'marked';

export default {
  name: 'PassageEditor',
  components: {
    'v-select': select,
    'picture-modal': pictureModal,
    'passage-view': PassageView
  },
  data(){
    return{
      id: -1,
      title: '',
      category: this.$store.state.passageCategories[0] || {
        id: -2,
        title: '加载分类数据中'
      },
      content: '',
      picUpload: false,
      viewMode: true,
      editorPos: 0,
      dropUploading: false,
      scrollDirty: false
    }
  },
  computed: {
    markdown(){
      return marked(this.content);
    },
    categories(){
      if(this.$store.state.passageCategories.length > 0 && this.category.id == -2){
        this.category = this.$store.state.passageCategories[0];
      }
      return this.$store.state.passageCategories;
    },
  },
  methods: {
    onChange(value){
      if(!value.id){
        value.id = -1;
      }
      this.category = value;
    },
    noSubmit(e){
      if(e.keyCode == 13){
        e.preventDefault();
      }
    },
    closeModal(){
      this.picUpload = false;
      let editor = this.$refs.editor;
      editor.focus();
      editor.selectionStart = this.editorPos;
      this.addPictureToEditor(this.$store.state.lastPicturesUploaded);
      //load uploaded picuters
    },
    addPictureToEditor(pictures){
      let editor = this.$refs.editor;
      let pos = editor.selectionStart || this.editorPos;
      for(let picture of pictures){
        let imgMarkdown = `\n![uploaded img](${picture.src})`;
        this.content = this.content.splice(pos, 0, imgMarkdown);
        pos += imgMarkdown.length;
      }
    },
    saveEditorPos(e){
      this.editorPos = e.target.selectionStart;
    },
    openPicModal(e){
      this.$store.commit('clearLastPassagePictures');
      this.picUpload = true;
    },
    //上传拖放的图片
    dropPics(e){
      e.preventDefault();
      e.stopPropagation();
      const files = e.dataTransfer.files,
            typeFilter = ['image/jpeg','image/png','image/gif','image/bmp'];
      if(files.length > 0){
        let fd = new FormData(),
            picNum = 0;
        //过滤图片类型
        for(let file of files){
          let typeRight = typeFilter.some((type)=>{
                            return type == file.type;
                          });
          if(!typeRight){
            continue;
          }else{
            fd.append('pictures', file);
            ++picNum;
          }
        }
        if(picNum > 0){
          this.dropUploading = true;
          this.$store.dispatch('PUSH_MESSAGE',{
            content: '图片上传中……',
            type: 'info'
          });
          this.$store.commit('clearLastPassagePictures');
          this.$store.dispatch('UPLOAD_PASSAGE_PICTURE', fd)
            .then((res)=>{
              if(typeof res == 'string'){
                this.$store.dispatch('PUSH_MESSAGE',{
                  content: '图片上传失败：' + res,
                  type: 'error'
                });
              }else{
                this.$store.commit('hasNewMessage', false);
                this.dropUploading = false;
                this.addPictureToEditor(this.$store.state.lastPicturesUploaded);
              }
            })
        }
      }
    },
    scroll(e){
      this.scrollDirty = !this.scrollDirty;
      if(this.scrollDirty){
        let node = e.target,
            pos = node.scrollTop,
            scrollBottom = node.scrollHeight - node.offsetHeight,
            ratio = pos / scrollBottom,
            another;
        if(node != this.$refs.editor){
          another = this.$refs.editor;
        }else{
          another = this.$refs.preview.$el;
        }
        let target = (another.scrollHeight - another.offsetHeight) * ratio;
        another.scrollTop = target;
      }
    },
    saveScript(e){
      e.preventDefault();
      e.stopPropagation();
      this.$store.dispatch('SAVE_TO_SCRIPT', {
        id: this.id,
        title: this.title,
        category: this.category,
        content: this.content
      }).then((res)=>{
        if(typeof res != 'string'){
          if(this.id == -1){
            this.id = res;
          }
          this.$store.dispatch('PUSH_MESSAGE', {
            content: '文章已保存为草稿: ' + new Date().Format('hh:mm:ss'),
            type: 'info'
          });
        }else{
          this.$store.dispatch('PUSH_MESSAGE', {
            content: '保存草稿失败，请检查您的网络链接，手动备份文章',
            type: 'error'
          });
          //handle error
        }
      })
    },
    publish(e){
      e.preventDefault();
      e.stopPropagation();
      console.log(this.id);
      this.$store.dispatch('PUBLISH', {
        id: this.id,
        title: this.title,
        category: this.category,
        content: this.content
      }).then((res)=>{
        if(typeof res != 'string'){
          this.$router.replace('/passages');
        }else{
          //handle error
        }
      })
    },
    handleSubmit(e){
      e.stopPropagation();
      e.preventDefault();
    }
  },
  beforeCreate(){
    if(!this.$store.state.user){
      this.$router.replace('/');
    }
  },
  mounted(){
    const id = this.$route.params.id,
          user = this.$store.state.user;
    this.$store.dispatch('FETCH_PASSAGECATEGORIES', user.id);
    if(id != '-1'){ //修改已有文章
      fetch(`/passages/${id}`, {
        method: 'GET'
      }).then((res)=>{
        return res.json();
      }).then((json)=>{
        console.log(json);
        if(json.passage.Category.User.id == user.id){
          this.id = json.passage.id,
          this.title = json.passage.title,
          this.category = json.passage.Category,
          this.content = json.content
        }
        else{
          //Hack?
        }
      });
    }
  }
}
</script>

<style scoped>
  .newPassage{
    display: flex;
    height: 100vh;
    overflow-y: hidden;
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
    padding: 0 .5rem;
    box-sizing: border-box;
  }
  label{
    display: inline-block;
    line-height: 36px;
    vertical-align: middle;
  }
  .v-select{
    display: inline-block;
    height: 36px;
    width: 40%;
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
    box-sizing: border-box;
    height: calc(100% - 72px) !important;
    margin-right: 2%;
    resize: none;
    font-size: 1.2rem;
    padding: .5rem;
  }
  .preview{
    text-align: left;
    width: 50%;
    height: 100%;
    padding-left: 1%;
    border-left: #fff 1px solid;
    overflow-y: auto;
  }
</style>
