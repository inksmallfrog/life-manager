<template>
  <div class="fileInput">
    <input type="file" name="pictures" accept="image/jpeg,image/png,image/gif,image/bmp" @change="handleChange" :multiple="multiple">
    <button>选择要上传的图片</button>
  </div>
</template>

<script>
export default {
  name: 'fileInputButton',
  props:{
    change: {
      type: Function
    },
    multiple: {
      type: Boolean
    }
  },
  methods:{
    handleChange: function(e){
      this.change(e);
    }
  }
}
</script>

<style scoped>
.fileInput{
  position: relative;
  margin-right: 2rem;
  margin-bottom: .5rem;
  width: 7rem;
  overflow-x: hidden;
  display: inline-block;
  vertical-align: middle;
  & input{
    position: absolute;
    width: calc(100% + 10rem);
    cursor: pointer;
    left: -10rem;
  }
  & button{
    position: relative;
    width: 100%;
    padding: 3px 0;
    background: #6c4;
    border: none;
    cursor: pointer;
    pointer-events: none;
  }
}
</style>
