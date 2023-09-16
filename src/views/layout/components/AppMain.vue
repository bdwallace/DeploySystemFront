<template>
  <div class="app-main">

    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>

  </div>

</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>
<style>
  h3  {
      text-align: right;
      margin-right: 10px;

  }
  .header {
      background-color: #99a9bf;
      /*height: 50px;*/
  }
  .header h3{
      line-height: 50px;
  }
</style>
