<template>
  <Card style="width:100%">
    <div slot="title">
      <span style="padding-left：20px">个人推广设置</span>
      <Button
        type="primary"
        style="float:right; padding-bottom:0px"
        @click="handleSubmit('formInline')"
      >
        <Icon type="md-checkmark" style="margin-right:6px;" />确定
      </Button>
    </div>

    <Form
      ref="formInline"
      label-position="right"
      :label-width="120"
      :model="formInline"
      :rules="ruleInline"
      inline
    >
      <Row>
        <FormItem label="产品名称" prop="productName">
          <Select
            v-model="formInline.productName"
            style="width:350px"
            @on-change="changeSelete($event)"
          >
            <Option v-for="item in products" :value="item.id" :key="item.id">{{ item.prod_name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="推广上限">
          <InputNumber disabled type="text" style="width:350px" v-model="formInline.up" />
        </FormItem>
      </Row>
      <FormItem label="个人收益" prop="myMoney">
        <InputNumber
          :disabled="disabled"
          style="width:350px"
          v-model="formInline.myMoney"
          @on-change="changeMyMoney"
        />
      </FormItem>
      <FormItem label="受邀人收益">
        <InputNumber
          disabled
          style="width:350px;position:relative"
          v-model="formInline.othersMoney"
        />
        <span
          v-if="this.formInline.othersMoney<this.formInline.down"
          style="position:absolute;top:30px;left:8px;color:red"
        >受邀人的最低收益不能低于:{{formInline.down}}</span>
      </FormItem>
    </Form>
  </Card>
</template>

<script>
export default {
  name: "my-set",
  data() {
    return {
      disabled: false,
      products: [],
      formInline: {
        up: null,
        productName: null,
        myMoney: null,
        othersMoney: null,
        down: null,
        prod_id: null
      },
      ruleInline: {
        myMoney: [
          {
            required: true,
            type: "number",
            message: "推广价不能为空！",
            trigger: "blur"
          }
          // {
          //   type: "string",
          //   pattern: /^\d+$/,
          //   message: "请输入数字",
          //   trigger: "blur"
          // }
        ],
        productName: [
          {
            required: true,
            type: "number",
            message: "产品名称不能为空！",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getProducts();
  },
  methods: {
    changeSelete(event) {
      console.log(event);
      this.disabled=false;
      this.formInline.up = null;
      this.formInline.myMoney = null;
      this.formInline.othersMoney = null;
      this.formInline.prop_id = event;
      // console.log(this.globalVariable.getUserInfo())
      this.$axios
        .post("/usersprofit/getSuperior", {
          open_id: this.globalVariable.getUserInfo().open_id,
          prod_id: this.formInline.prop_id
          // open_id: "oSclW44Yr4rvm6jviSSNQgePk8jA",
          // prod_id: 1
        })
        .then(res => {
          console.log(res);
          if (res.data.content !== null) {         
            this.formInline.up = res.data.content.lvl_money;
            this.formInline.down = res.data.content.lvl_low;
            if (res.data.content.my_money) {
              this.formInline.myMoney = res.data.content.my_money;
            } else {
              this.formInline.myMoney = null;
            }
            if (res.data.content.shar_money) {
              this.formInline.othersMoney = res.data.content.shar_money;
            } else {
              this.formInline.othersMoney = res.data.content.lvl_low;
            }
          } else {
            console.log(111)
            this.disabled=true;
          }
        })
        .catch(error => {
          // console.log(error);
        });
    },
    changeMyMoney() {
      this.formInline.othersMoney =
        this.formInline.up - this.formInline.myMoney;
    },
    getProducts() {
      this.$axios
        .post("/sysproduct/getList", {
          product_type: 2
        })
        .then(res => {
          // console.log(res);
          this.products = res.data.content.list;
        })
        .catch(error => {
          // console.log(error);
        });
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.formInline.othersMoney < this.formInline.down) {
            this.$Message.error("请检查表单的有效性");
          } else {
            this.$axios.post("/usersprofit/saveOne", {
              open_id: this.globalVariable.getUserInfo().open_id,
              prod_id: this.formInline.prop_id,
              my_money: this.formInline.myMoney,
              shar_money: this.formInline.othersMoney,
              all_money: this.formInline.up,
              low_money: this.formInline.down
            });
            this.$Message.success("提交成功");
          }
        } else {
          this.$Message.error("请检查表单的有效性");
        }
      });
    }
  }
};
</script>

<style>
</style>
