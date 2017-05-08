<template>
  <div class="inputGroup">
    <input type="text" :name="name" :value="value" :placeholder="placeholder" :class="{hasError: error, isOk: ok}" @input="handleInput" @change="change">
    <span :class="[icon, {hasError: error, isOk: ok}]"></span>
    <p class="error" v-if="error">{{ error }}</p>
  </div>
</template>

<script>
  export default {
    name: 'inputGroup',
    props: {
      name: {
        type: String,
        required: true
      },
      value: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      },
      error: {
        type: String,
        default: ''
      },
      icon: {
        type: String,
        default: ''
      },
      change: {
        type: Function,
        default: (e)=>{e.stopPropagation(); e.preventDefault();}
      }
    },
    computed:{
      ok(){
        return this.value && !this.error;
      }
    },
    methods: {
      handleInput(){
        this.$emit('input');
      }
    }
  }
</script>

<style scoped>
  input{
    display: block;
    width: 40%;
    margin: 10px auto;
    border: none;
    border-bottom: #aaa 1px solid;
    outline: none;
    transition: border .5s;
  }
  input:focus{
    outline: none;
    border-bottom-color: #666;
  }
  .error{
    color: red;
    margin: 0;
    margin-top: -10px;
  }
</style>
