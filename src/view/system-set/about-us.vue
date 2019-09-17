<template>
  <Card>
    <p slot="title">关于我们</p>
    <Card>
      <p slot="title">隐私</p>
      <div>{{privacy}}</div>
    </Card>
    <Card>
      <p slot="title">服务协议</p>
      <div>{{service}}</div>
    </Card>
    <Card>
      <p slot="title">关于我们</p>
      <div>{{about_us}}</div>
    </Card>
  </Card>
</template>

<script>
export default {
  name: "about_us",
  data() {
    return {
      privacy: "",
      service: "",
      about_us: ""
    };
  },
  methods: {
    getData() {
      this.$axios
        .post("/sysaboutus/getList",{
          open_id:this.globalVariable.getUserInfo().open_id
        })
        .then(res => {
          console.log(res);
          this.privacy = res.data.content[0].privacy;
          this.service = res.data.content[0].service;
          this.about_us = res.data.content[0].about_us;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    this.getData();
  }
};
</script>
<style scoped>
</style>
>
</style>
