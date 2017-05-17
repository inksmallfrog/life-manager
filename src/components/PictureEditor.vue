<script>
  /*
   * 编辑图片的对话框
   */
</script>

<template>
  <div class="box" @click.stop>
    <input type="file" name="pictures" accept="image/jpeg,image/png,image/gif,image/bmp" @change="handlePicture">
    <div class="pictureBox">
      <canvas class="editor" ref="editor"></canvas>
      <canvas class="cover" ref="cover" @mousewheel="handleWheel" @mousedown="dragStart" @mouseup="isDragging = false" @mousemove="drag"></canvas>
    </div>
    <button @click.prevent.stop="zoomIn">放大</button>
    <button @click.prevent.stop="zoomOut">缩小</button>
    <button @click.prevent.stop="submit">确定</button>
    <div v-if="isUploading">上传中...</div>
    <canvas class="result" ref="result"></canvas>
  </div>
</template>

<script>
export default {
  name: 'pictureEditor',
  data(){
    return{
      isCircle: this.state.isCircle,

      url: '',
      targetX: 0,
      targetY: 0,
      dragDirtaX: 0,
      dragDirtaY: 0,
      targetSize: 120,
      editorCtx: null,
      coverCtx: null,
      isDragging: false,
      isUploading: false
    }
  },
  props: {
    state:{
      type: Object,
      require: true
    },
  },
  methods: {
    modalSpaceClick(e){
      this.$emit('close');
      e.stopPropagation();
      e.preventDefault();
    },
    handlePicture(e){
      let file = e.target.files[0],
          fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = (e)=>{
        this.paintPicture(e.target.result);
        this.url = e.target.result;
      }
    },
    paintPicture(url){
      let editor = this.$refs.editor,
          cover = this.$refs.cover,
          ctx = this.editorCtx,
          img = new Image(),
          imgWidth,
          imgHeight;
      img.src = url;
      img.onload = ()=>{
        if (img.width < editor.offsetWidth && img.height < editor.offsetHeight) {
          imgWidth = img.width;
          imgHeight = img.height;
        }else{
          let pWidth = img.width / (img.height / editor.offsetHeight),
              pHeight = img.height / (img.width / editor.offsetWidth);
          imgWidth = img.width > img.height ? editor.offsetWidth : pWidth;
          imgHeight = img.height > img.width ? t.regional.offsetHeight : pHeight;
        }

        editor.height = imgHeight;
        editor.width = imgWidth;
        cover.height = imgHeight;
        cover.width = imgWidth;

        ctx.drawImage(img,0,0,imgWidth,imgHeight);
        this.paintCut();
      }
    },
    paintCut(){
      const cover = this.$refs.cover;
      let ctx = this.coverCtx;
      ctx.clearRect(0,0, cover.width, cover.height);

      //绘制遮罩区域
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.beginPath();
      ctx.rect(0,0, cover.width, cover.height);
      ctx.fill();
      //扣取图像
      if(this.isCircle){
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(this.targetX + this.targetSize / 2, this.targetY + this.targetSize / 2, this.targetSize / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }else{
        ctx.clearRect(this.targetX, this.targetY, this.targetSize, this.targetSize);
      }
    },
    /*
     * 判断点是否在图片裁剪区域中
     * @param x, x坐标，相对于屏幕
     *        y, y坐标，相对于屏幕
     * @return {
     *            isHit, 是否在裁剪区域中
     *            relativeX, 相对于canvas的x坐标
     *            relativeY, 相对于canvas的y坐标
     *            dirtaX, 相对于裁剪区域的x坐标
     *            dirtaY, 相对于裁剪区域的y坐标
     *         }
     */
    isPointInPictureCut(x, y){
      const cover = this.$refs.cover,
            coverRect = cover.getBoundingClientRect(),
            relativeX = x - Math.floor(coverRect.left),
            relativeY = y - Math.floor(coverRect.top),
            dirtaX = relativeX - this.targetX,
            dirtaY = relativeY - this.targetY;
      let isHit = dirtaX >= 0 && dirtaX <= this.targetSize
                    && dirtaY >= 0 && dirtaY <= this.targetSize;
      return{
        isHit,
        relativeX,
        relativeY,
        dirtaX,
        dirtaY
      };
    },
    dragStart(e){
      const hitTestResult = this.isPointInPictureCut(e.pageX,e.pageY);
      if(hitTestResult.isHit){
        this.isDragging = true
        this.dragDirtaX = hitTestResult.dirtaX;
        this.dragDirtaY = hitTestResult.dirtaY;
      }
    },
    drag(e){
      const hitTestResult = this.isPointInPictureCut(e.pageX,e.pageY),
            cover = this.$refs.cover;
      if(hitTestResult.isHit){
        cover.style.cursor = 'move';
        if(this.isDragging){
          this.targetX = hitTestResult.relativeX - this.dragDirtaX;
          this.targetY = hitTestResult.relativeY - this.dragDirtaY;
          if(this.targetX < 0){
            this.targetX = 0;
            this.dragDirtaX = hitTestResult.relativeX;
          }else if(this.targetX > cover.width - this.targetSize){
            this.targetX = cover.width - this.targetSize;
            this.dragDirtaX = hitTestResult.relativeX - this.targetX;
          }
          if(this.targetY < 0){
            this.targetY = 0;
            this.dragDirtaY = hitTestResult.relativeY;
          }else if(this.targetY > cover.height - this.targetSize){
            this.targetY = cover.height - this.targetSize;
            this.dragDirtaY = hitTestResult.relativeY - this.targetY;
          }
          this.paintCut();
        }
      }
      else{
        cover.style.cursor = 'default';
      }
    },
    handleWheel(e){
      const hitTestResult = this.isPointInPictureCut(e.pageX,e.pageY);
      if(hitTestResult.isHit){
        if(e.wheelDelta < 0){
          this.zoomOut();
        }else if(e.wheelDelta > 0){
          this.zoomIn();
        }
      }
    },
    zoomIn(){
      const cover = this.$refs.cover,
            minLength = Math.min(cover.width, cover.height);
      this.targetSize = Math.min(this.targetSize + 10, minLength);
      if(this.targetX + this.targetSize > cover.width){
        this.targetX = cover.width - this.targetSize;
      }
      if(this.targetY + this.targetSize > cover.height){
        this.targetY = cover.height - this.targetSize;
      }
      this.paintCut();
    },
    zoomOut(){
      this.targetSize = Math.max(this.targetSize - 10, 120);
      this.paintCut();
    },
    submit(){
      if(this.isUploading){
        return false;
      }
      else{
        const result = this.$refs.result,
              editor = this.$refs.editor;
        result.width = this.targetSize;
        result.height = this.targetSize;
        let ctx = result.getContext('2d'),
            image = new Image();
        image.src = editor.toDataURL();
        image.onload = ()=>{
          ctx.drawImage(image,this.targetX, this.targetY, this.targetSize, this.targetSize, 0, 0, this.targetSize, this.targetSize);
          result.toBlob((blob)=>{
            let data = new FormData();
            data.append('favicon', blob);
            this.$store.dispatch('UPLOAD_FAVICON', data)
              .then((res)=>{
                if(!res.hasError){
                  this.$store.commit('closeModal');
                }
                this.isUploading == false;
              })
          })
          this.isUploading = true;
        }
      }
    }
  },
  mounted(){
    this.$refs.editor.width = 0;
    this.$refs.editor.height = 0;
    this.editorCtx = this.$refs.editor.getContext('2d');
    this.coverCtx = this.$refs.cover.getContext('2d');
  }
};
</script>

<style scoped>
  .modal{
    position: fixed;
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(128, 128, 128, 0.5);
  }
  .box{
    position: relative;
    margin: auto;
    width: 40%;
    height: 350px;
    background: white;
    border-radius: 2px;
    overflow-x: hidden;
  }
  .pictureBox{
    position: relative;
    width: 80%;
    margin: 0 auto;
  }
  .editor{
    width: 100%;
  }
  .cover{
    position: absolute;
    width: 100%;
    display: block;
    left: 0;
    top: 0;
  }
  .result{
    display: none;
  }
</style>
