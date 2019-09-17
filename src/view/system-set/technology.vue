<template>
  <Card>
    <p slot="title">
      <!-- <Icon type="md-cog"></Icon> -->
      技术支持
    </p>
    <p>{{text}}</p>
  </Card>
</template>

<script>
export default {
  name: 'technology',
  data () {
    return {
      text: '技术支持'
    }
  },
  methods: {
    getData(){
      this.$axios
        .post("/syssupport/getList")
        .then(res => {
          console.log(res);
          this.text = res.data.content[0].content;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    this.getData();
  }
}
</script>
<style scoped>
</style>
>
</style>
