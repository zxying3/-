<template>
  <div>
    <Card>
      <div slot="title">
        <Icon type="md-cog"></Icon>
        <span style="padding-left：20px">图片列表</span>
      </div>
      <div class="demo-upload-list" v-for="item in images" :key="item.index">
        <template>
          <img :src="item.top_pic" />
          <div class="demo-upload-list-cover" v-if="globalVariable.getUserInfo().web_account==='admin'">
            <Icon type="ios-trash-outline" @click.native="handleRemoveImage(item)"></Icon>
          </div>
        </template>
      </div>
      <div v-if="globalVariable.getUserInfo().web_account==='admin'">
        <input id="image" type="file" accept="image/*" />
        <button @click="uploadImage">确定</button>
      </div>
    </Card>
    <Card>
      <div slot="title">
        <Icon type="md-cog"></Icon>
        <span style="padding-left：20px">视频列表</span>
      </div>
      <div class="demo-upload-list" v-for="item in videos" :key="item.index">
        <template>
          <video :src="item.top_video" controls="controls" />
          <div class="demo-upload-list-cover" v-if="globalVariable.getUserInfo().web_account==='admin'">
            <Icon type="ios-trash-outline" @click.native="handleRemoveVideo(item)"></Icon>
          </div>
        </template>
      </div>
      <div v-if="globalVariable.getUserInfo().web_account==='admin'">
        <input id="video" type="file" accept="video/*" />
        <button onclick="uploadVideo">确定</button>
      </div>
      <!-- <el-dialog title="查看视频" :visible.sync="videoVisible" style="text-align: left">
        <img
          :src="top_video"
          style="width: 100%"
        />
      </el-dialog>-->
    </Card>
  </div>
</template>
<script>
export default {
  name: "home",
  data() {
    return {
      videoVisible: false,
      imgName: "",
      images: [],
      videos: [],
      top_pic: "",
      top_video: ""
    };
  },
  methods: {
    getData() {
      this.$axios.post("/systop/getList").then(res => {
        // console.log(res);
        this.images = res.data.content.list.filter(
          item => item.top_pic !== "" && item.top_pic !== null
        );
        this.videos = res.data.content.list.filter(
          item => item.top_video !== "" && item.top_video !== null
        );
        console.log(this.videos);
      });
    },
    handleRemoveImage(file) {
      console.log(file);
      this.$axios
        .post("/systop/updateById", {
          id: file.id,
          top_pic: "",
          top_video: file.top_video
        })
        .then(res => {
          this.getData();
        })
        .catch(error => {
          // console.log(error);
        });
    },
    // handleView(file) {
    //   console.log(file)
    //   this.videoVisible = true;
    //   console.log(this.videoVisible)
    // },
    handleRemoveVideo(file) {
      this.$axios
        .post("/systop/updateById", {
          id: file.id,
          top_pic: file.top_pic,
          top_video: ""
        })
        .then(res => {
          this.getData();
        })
        .catch(error => {
          // console.log(error);
        });
    },
    // 上传图片
    uploadImage() {
      var file = document.getElementById("image");
      var formData = new FormData();
      formData.append("file ", file.files[0]);
      this.$axios
        .post("/upload/easyUpload", formData, {
          headers: { "Content-Type": "application/form-data" }
        })
        .then(res => {
          console.log(res);
          this.top_pic = res.data.content;
          this.addImage();
        })
        .catch(error => {
          // console.log(error);
        });
    },
    // 添加图片（先上传到服务器，再添加）
    addImage() {
      this.$axios
        .post("/systop/saveOne", {
          top_pic: this.top_pic
        })
        .then(res => {
          this.getData();
        })
        .catch(error => {
          // console.log(error);
        });
    },
    // 上传视频
    uploadVideo() {
      var file = document.getElementById("video");
      var formData = new FormData();
      formData.append("file ", file.files[0]);
      this.$axios
        .post("/upload/easyUpload", formData, {
          headers: { "Content-Type": "application/form-data" }
        })
        .then(res => {
          console.log(res);
          this.top_video = res.data.content;
          this.addVideo();
        })
        .catch(error => {
          // console.log(error);
        });
    },
    // 添加视频
    addVideo() {
      this.$axios
        .post("/systop/saveOne", {
          top_video: this.top_video
        })
        .then(res => {
          this.getData();
        })
        .catch(error => {
          // console.log(error);
        });
    }
  },
  created() {
    this.getData();
  }
};
</script>
<style>
.demo-upload-list {
  display: inline-block;
  width: 150px;
  height: 150px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list video {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  /* background: rgba(0, 0, 0, 0.6); */
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover{
  height:50px;
}
.demo-upload-list-cover i {
  color: #000;
  font-size: 20px;
  cursor: pointer;
  margin: 60px 0px;
}
</style>
