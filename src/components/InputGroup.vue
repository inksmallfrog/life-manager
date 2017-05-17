<script>
  /*
   * 输入框组件
   */
</script>

<template>
  <div class="inputGroup">
    <span :class="['before', 'iconfont', icon, {'clickable': switchPsdView}]" @click="iconClick"></span>
    <input type="text" :type="type" :name="name" :value="value" :placeholder="placeholder" :class="{hasError: error, isOk: ok}" @input="updateValue($event.target.value)" @change="handleChange">
    <span :class="['after', 'iconfont', {'icon-error': error, 'icon-ok': ok}]"></span>
    <div class="errorBox" v-if="error">
      <span class="errorArrow"></span>
      <p class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'inputGroup',
    props: {
      /*
       * input name
       */
      name: {
        type: String,
        required: true
      },
      /*
       * input type
       */
      type:{
        type: String,
        default: 'text'
      },
      /*
       * input value
       */
      value: {
        type: String,
        default: ''
      },
      /*
       * input placeholder
       */
      placeholder: {
        type: String,
        default: ''
      },
      /*
       * error message
       */
      error: {
        type: String,
        default: ''
      },
      /*
       * icon on the left
       */
      icon: {
        type: String,
        default: ''
      },
      /*
       * this is only designed for type='password'
       *
       * if the value is true, the icon will be clickable
       */
      switchPsdView: {
        type: Boolean,
        default: false
      },
      /*
       * this is only designed for type='password'
       * only works when the switchPsdView is true
       *
       * the callback function when the icon is clicked
       */
      iconClick:{
        type: Function,
        default: (e)=>{e.stopPropagation(); e.preventDefault();}
      },
      /*
       * input event callback
       */
      input: {
        type: Function,
        default: (e)=>{e.stopPropagation(); e.preventDefault();}
      },
      /*
       * change event callback
       */
      change: {
        type: Function,
        default: (e)=>{e.stopPropagation(); e.preventDefault();}
      }
    },
    data(){
      return{
        localValue: ''
      }
    },
    computed:{
      ok(){
        return this.localValue && !this.error;
      }
    },
    methods: {
      updateValue(value){
        this.$emit('input', value);
        if(this.localValue){
          this.localValue = '';
        }
        this.input();
      },
      handleChange(event){
        this.localValue = this.$el.querySelector('input').value;
        this.change(event);
      }
    }
  }
</script>

<style scoped>
  div{
    position: relative;
    width: 40%;
    margin: auto;
  }
  .before{
    position: absolute;
    top: 0;
    left: -20px;
  }
  .before.clickable{
    cursor: pointer;
  }
  input{
    display: block;
    width: 100%;
    margin: 10px auto;
    padding: 0 5px;
    font-size: 1.2rem;
    border: none;
    border-bottom: #aaa 1px solid;
    outline: none;
    transition: border .5s, box-shadow .5s;
  }
  input:focus{
    outline: none;
    box-shadow: 0px 1px 1px rgba(100, 100, 100, 0.4);
  }
  input.hasError:focus{
    box-shadow: 0px 1px 1px rgba(255, 0, 0, 0.4);
  }
  input.isOk:focus{
    box-shadow: 0px 1px 1px rgba(0, 255, 0, 0.4);
  }
  .after{
    position: absolute;
    top: 0;
    right: 0;
  }
  .after.icon-error{
    color: red;
  }
  .after.icon-ok{
    color: green;
  }
  .errorBox{
    position: relative;
    top: 5px;
    background: red;
    color: white;
    width: 100%;
    border-radius: 3px;
  }
  .errorArrow{
    position: absolute;
    top: -20px;
    right: 0;
    border-left: transparent 10px solid;
    border-right: transparent 10px solid;
    border-top: transparent 10px solid;
    border-bottom: red 10px solid;
  }
  .error{
    margin: 0;
    margin-top: -10px;
    margin-bottom: 20px;
  }
</style>
