<template>
  <Card>
    <div slot="title" style="height:30px">
      <!-- <Icon type="md-cog"></Icon> -->
      订单导入
      <Button
        @click="handleSubmit('formInline')"
        style="float:right; padding-bottom:0px"
        type="primary"
      >
        <Icon type="md-checkmark" />确定
      </Button>
    </div>
    <Form
      :label-width="120"
      :model="formInline"
      :rules="ruleValidate"
      label-position="right"
      ref="formInline"
    >
      <FormItem label="产品名称：" prop="product">
        <Select
          @on-change="changeSelete($event)"
          style="width:300px;height:38px;"
          v-model="formInline.product"
        >
          <Option :key="item.id" :label="item.prod_name" :value="item.id" v-for="item in products"></Option>
        </Select>
      </FormItem>
      <FormItem label="导入excel：" prop="file">
        <!-- <input type="file"/> -->
        <!-- <Upload
          action="http://192.168.0.108:8888/api/excel/excelToAnalyze"
          :before-upload="handleBeforeUpload"
          accept=".xls, .xlsx"
        >
          <Button
            icon="ios-cloud-upload-outline"
            :loading="uploadLoading"
            @click="handleUploadFile"
          >上传文件</Button>
        </Upload>
        <Row>
          <div class="ivu-upload-list-file" v-if="file !== null">
            <Icon type="ios-stats"></Icon>
            {{ file.name }}
            <Icon
              v-show="showRemoveFile"
              type="ios-close"
              class="ivu-upload-list-remove"
              @click.native="handleRemove()"
            ></Icon>
          </div>
        </Row>
        <Row>
          <transition name="fade">
            <Progress v-if="showProgress" :percent="progressPercent" :stroke-width="2">
              <div v-if="progressPercent == 100">
                <Icon type="ios-checkmark-circle"></Icon>
                <span>成功</span>
              </div>
            </Progress>
          </transition>
        </Row>-->
        <input type="file" ref="import-btn" id="import-btn" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
      </FormItem>
    </Form>
  </Card>
</template>
<script>
import excel from "@/libs/excel";
export default {
  name: "order-import",
  data() {
    return {
      formData: null,
      prod_id: null,
      formInline: {
        product: null,
        // file:null
      },
      products: [],
      ruleValidate: {
        product: [
          {
            required: true,
            type: "number",
            message: "产品名称不能为空！",
            trigger: "change"
          }
        ],
        // file: [{ required: true, message: "文件不能为空", trigger: "blur" }]
      },
      uploadLoading: false,
      progressPercent: 0,
      showProgress: false,
      showRemoveFile: false,
      file: null,
      tableData: [],
      tableTitle: [],
      tableLoading: false
    };
  },
  created() {
    this.getData();
  },
  methods: {
    changeSelete(event) {
      console.log(event);
      this.prod_id = event;
    },
    // 获取下拉框产品列表
    getData() {
      this.$axios
        .post("/sysproduct/getList", {
          product_type: 2,
          pageSize: 10,
          pageNum: this.currentPage
        })
        .then(res => {
          console.log(res);
          this.products = res.data.content.list;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          var file = document.querySelector("[type=file]");
          if(file.files[0]){
            // 通过FormData将文件转成二进制数据
          var formData = new FormData();
          // 将文件转二进制

          formData.append("file", file.files[0]);
          formData.append("prod_id", this.prod_id);
          this.$axios
            .post("/excel/excelToAnalyze", formData, {
              headers: { "Content-Type": "application/form-data" }
            })
            .then(res => {
              console.log(res);
              // this.$Message.success("添加成功");
            })
            .catch(error => {
              // console.log(error);
            });
          this.$Message.success("提交成功");
          }else{
            this.$Message.error('请检查表单的有效性')
          }
          
        } else {
          this.$Message.error("请检查表单的有效性");
        }
      });
    }

    // excel文件相关
    // initUpload() {
    //   this.file = null;
    //   this.showProgress = false;
    //   this.loadingProgress = 0;
    // },
    // handleUploadFile() {
    //   this.initUpload();
    // },
    // handleRemove() {
    //   this.initUpload();
    //   this.$Message.info("上传的文件已删除！");
    // },
    // handleBeforeUpload(file) {
    //   console.log(file);
    //   const fileExt = file.name
    //     .split(".")
    //     .pop()
    //     .toLocaleLowerCase();
    //   if (fileExt === "xlsx" || fileExt === "xls") {
    //     this.readFile(file);
    //     this.file = file;
    //     this.formData=new FormData();
    //     formData.append('file',this.file)
    //     formData.append('prod_id',this.prod_id)
    //     console.log(this.formData)
    //   } else {
    //     this.$Notice.warning({
    //       title: "文件类型错误",
    //       desc:
    //         "文件：" +
    //         file.name +
    //         "不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。"
    //     });
    //   }
    //   return false;
    // },
    // // 读取文件
    // readFile(file) {
    //   const reader = new FileReader();
    //   reader.readAsArrayBuffer(file);
    //   // onloadstart文件开始读取
    //   reader.onloadstart = e => {
    //     this.uploadLoading = true;
    //     this.showProgress = true;
    //   };
    //   reader.onprogress = e => {
    //     this.progressPercent = Math.round((e.loaded / e.total) * 100);
    //   };
    //   reader.onerror = e => {
    //     this.$Message.error("文件读取出错");
    //   };
    //   // onload文件读取完成
    //   reader.onload = e => {
    //     console.log(e);
    //     this.$Message.info("文件读取成功");
    //     const data = e.target.result;
    //     const { header, results } = excel.read(data, "array");
    //     this.uploadLoading = false;
    //     this.showRemoveFile = true;
    //   };
    // }

    //   $(document).ready(function(){
    //   $('#import-btn').change(function () {
    //     var formData = new FormData()
    //         name = $(this).val()
    //         formData.append('file', $(this)[0].files[0])
    //         // 此处可传入多个参数
    //         formData.append('name', name)
    //         console.log(formData)
    //     $.ajax({
    //         url:  webRoot + '/deviceinfoup/export',
    //         type: 'post',
    //         async: false,
    //         data: formData,
    //         // 告诉jQuery不要去处理发送的数据
    //         processData: false,
    //         // 告诉jQuery不要去设置Content-Type请求头
    //         contentType: false,
    //         beforeSend: function () {
    //             console.log('正在进行，请稍候')
    //         },
    //         success: function (res) {
    //             if (+res === '01') {
    //                 console.log('导入成功')
    //             } else {
    //                 console.log('导入失败')
    //             }
    //          }
    //     })
    //   })
    // })
  }
};
</script>
