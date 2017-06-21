<script>
  /*
   * todo页
   */
</script>
<template>
  <div class="todo">
    <form action="">
      <input type="todo" placeholder="内容">
      DDL计划<input type="radio" name="type" value="temp" checked>
      日计划<input type="radio" name="type" value="daily">
      周计划<input type="radio" name="type" value="weekly">
      月计划<input type="radio" name="type" value="monthly">
      年计划<input type="radio" name="type" value="yearly">
      人生计划<input type="radio" name="type" value="life">
      <calender v-if="ddl"></calender>
    </form>
    <ul>
      <li v-for="todo in todos">
        {{ todo.content }}
      </li>
    </ul>
  </div>
</template>

<script>
import Calendar from '@/components/Calendar'

export default {
  name: 'todo',
  components: {
    calendar: Calendar
  },
  data(){
    return{
      ddl: true
    }
  },
  computed:{
    categories(){
      return this.$store.state.todoCategories;
    },
    todos(){
      return this.$store.state.todos;
    }
  },
  beforeCreate(){
    this.$store.dispatch('CHECK_LOGGED');
  },
  beforeMount(){
    const user = this.$store.state.user;
    if(!user){
      this.$router.replace('/');
    }
  },
  mounted(){
    this.$store.state.dispatch('FETCH_TODOCATEGORIES');
    this.$store.state.dispatch('FETCH_TODO');
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
