<template>
  <div>
    <Card>
      <div slot="title">
        <Icon type="md-cog"></Icon>
        <span style="padding-left：20px">图片列表</span>
      </div>
      <div class="demo-upload-list" v-for="item in images" :key="item.index">
        <template>
          <img :src="item" />
          <div class="demo-upload-list-cover">
            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
          </div>
        </template>
      </div>
      <div>
         <!-- <div style="display:inline-block;width: 150px;height:150px;line-height: 150px;border:1px solid #333;">
          <Icon type="ios-camera" size="20"></Icon>
        </div> -->
         <input type="file" id="file1" name="myfile"  accept="image/*" />
         <button @click="saveOne">确定</button>
        </div>
    </Card>
  </div>
</template>
<script>
export default {
  name: 'lbimages',
  data () {
    return {
      images: [],
      img:null,
      id:"",
      imgName: '',
      visible: false
    }
  },
  methods: {
    getImages () {
      this.$axios
        .post("/businesspage/getList")
        .then(res => {
          // console.log(res)
          this.images = res.data.content[0].head_img.split(",");
          this.id=res.data.content[0].id;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleRemove (file) {
      console.log(file)
      this.images.splice(this.images.indexOf(file), 1);
      // console.log(this.images);
      let str=this.images.join(",");
      // console.log(str)
      this.$axios
        .post("/businesspage/updateById", {
          head_img: str,
          id:this.id
        })
        .then(res => {
          this.getImages();
          console.log(this.images)
          this.$Message.success("删除成功");
        })
        .catch(err => {
          this.$Message.error("删除失败");
        });
    },
    //确定按钮
    saveOne(){
      var file = document.querySelector("[type=file]");     
          var formData = new FormData();
          formData.append("file", file.files[0]);
          this.$axios
            .post("/upload/easyUpload", formData, {
              headers: { "Content-Type": "application/form-data" }
            })
            .then(res => {
              // console.log(res);
              this.img=res.data.content;
              this.$Message.success("添加成功");
              this.save();
            })
            .catch(error => {
              // console.log(error);
            });
    },
    save(){
      this.images.push(this.img);
      let str=this.images.join(",");
     this.$axios
            .post("/businesspage/updateById",  {
             head_img: str,
             id:this.id
            })
            .then(res => {
              console.log(res);
              this.getImages();
            })
            .catch(error => {
              // console.log(error);
            });
    }
  },
  created(){
    this.getImages();
  }
}
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
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 60px 60px;
}
</style>
