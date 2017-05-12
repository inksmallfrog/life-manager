<template>
  <div class="modal" @click="modalSpaceClick">
    <div class="box" @click="boxClick">
      <form action="/pictures" method="POST" id="pictureForm" @submit.prevent="picUpload" enctype="multipart/form-data">
        <input type="file" name="pictures" accept="image/jpeg,image/png,image/gif,image/bmp" multiple @change="addPics" @click="handleFileInput">
      </form>
      <div class="picBox" @drop="dropPics">
        <div class="picPreview" v-for="picture in pictures">
          <img :src="picture.src" alt="">
          <p v-if="!picture.finished">{{ uploadingState }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pictureModal',
  data(){
    return {
      pictures: [],
      uploadingState: ''
    };
  },
  computed: {
    lastUploadFinished(){
      return this.pictures.some((picture)=>{
        return !picture.finished;
      })
    }
  },
  methods: {
    modalSpaceClick(e){
      this.$emit('close');
      e.stopPropagation();
      e.preventDefault();
    },
    boxClick(e){
      e.stopPropagation();
    },
    picUpload(e){
      e.stopPropagation();
      e.preventDefault();
    },
    addPics(e){
      let fd = new FormData(document.querySelector('#pictureForm'));
      this.$store.dispatch('UPLOAD_PASSAGE_PICTURE', fd)
        .then((res)=>{
          if(typeof res == 'string'){
            this.uploadingState = res;
          }else{
            this.pictures.forEach((picture)=>{
              picture.finished = true;
            });
          }
        })
      let files = e.target.files;
      for(let file of files){
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e)=>{
          this.pictures.push({src:reader.result, finished:false});
        }
      }
      e.stopPropagation();
      e.preventDefault();
    },
    handleFileInput(e){
      if(!this.lastUploadFinished){
        e.preventDefault();
        e.stopPropagation();
      }
    },
    dropPics(e){
      e.stopPropagation();
      e.preventDefault();
      const files = e.dataTransfer.files,
            typeFilter = ['image/jpeg','image/png','image/gif','image/bmp'];
      if(files.length > 0){
        let fd = new FormData(),
            picNum = 0;

        for(let file of files){
          let typeRight = typeFilter.some((type)=>{
                            return type == file.type;
                          });
          if(!typeRight){
            continue;
          }else{
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e)=>{
              this.pictures.push({src:reader.result, finished:false});
            }
            fd.append('pictures', file);
            ++picNum;
          }
        }
        if(picNum > 0){
          this.$store.dispatch('UPLOAD_PASSAGE_PICTURE', fd)
            .then((res)=>{
              if(typeof res == 'string'){
                this.uploadingState = res;
              }else{
                this.pictures.forEach((picture)=>{
                  picture.finished = true;
                });
              }
            })
        }
      }
    },
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
  img{
    width: 150px;
  }
  .picBox{
    border: 1px #000 solid;
    width: 80%;
    min-height: 100px;
  }
</style>
