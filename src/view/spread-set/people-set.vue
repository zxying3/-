<template>
  <Card>
    <div slot="title">
      受邀人推广设置
      <Button
        @click="handleAdd"
        size="small"
        style="float:right; padding-bottom:3px;margin-right:20px;"
        type="info"
      >新增</Button>
      <Select
        @on-change="changeSelete($event)"
        placeholder="请选择产品名称"
        style="width:200px"
        v-model="product"
      >
        <Option :key="item.id" :value="item.id" v-for="item in products">{{ item.prod_name }}</Option>
      </Select>
    </div>
    <!-- 新增弹窗 -->
    <el-dialog :visible.sync="addFormVisible" style="text-align: left" title="新增">
      <Form
        :label-width="120"
        :model="addform"
        :rules="ruleInline"
        label-position="right"
        ref="addform"
      >
        <FormItem label="等级" prop="level">
          <InputNumber
            
            style="width:300px;"
            v-model="addform.level"
            @on-blur="levelChange"
          />
        </FormItem>
        <!-- <FormItem label="产品大类" prop="name">
          <Select :model="addform.category" autocomplete="off" style="width:300px;"  @on-change="changeCategory($event)">
            <Option
              v-for="item in categorys"
              :key="item.id"
              :value="item.id"
            >{{ item.prod_name }}</Option>
          </Select>
        </FormItem>-->
        <FormItem label="产品名称" prop="productAdd">
          <Select
            v-model="addform.productAdd"
            
            style="width:300px;"
            @on-change="changeAddProduct"
          >
            <Option :key="item.id" :value="item.id" v-for="item in products">{{ item.prod_name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="产品推广价">
          <InputNumber disabled  style="width:300px;" v-model="addform.price" />
        </FormItem>
        <FormItem label="总收益" prop="up">
          <InputNumber
            :max="addform.price"
            placeholder="总收益不得高于推广价"
            style="width:300px;"
            v-model="addform.up"
          />
        </FormItem>
        <FormItem label="受邀人最低收益" prop="down">
          <InputNumber :max="addform.up"  style="width:300px;" v-model="addform.down" />
        </FormItem>
        <FormItem label="最小邀请人数" prop="min">
          <InputNumber disabled  style="width:300px;" v-model="addform.min" />
        </FormItem>
        <FormItem label="最大邀请人数" prop="max">
          <InputNumber placeholder="不得低于最小邀请人数" :min="addform.min"  style="width:300px;" v-model="addform.max" />
        </FormItem>
      </Form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button @click="addSubmit('addform')" type="primary">确 定</el-button>
      </div>
    </el-dialog>
    <!-- table -->
    <el-table
      :data="tableData"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      empty-text="暂无数据"
      style="width: 100%"
    >
      <el-table-column align="center" label="序号">
        <template slot-scope="scope">
          <span>{{ (scope.$index+1) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="等级">
        <template slot-scope="scope">
          <span>{{ scope.row.lvl_number }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="产品名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="总收益">
        <template slot-scope="scope">
          <span>{{ scope.row.lvl_money }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="受邀人最低收益">
        <template slot-scope="scope">
          <span>{{ scope.row.lvl_low }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最小邀请人数">
        <template slot-scope="scope">
          <span>{{ scope.row.lvl_start }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最大邀请人数">
        <template slot-scope="scope">
          <span>{{ scope.row.lvl_end }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.$index, scope.row)" size="mini">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- table-footer -->
    <Page
      :current="currentPage"
      :total="total"
      @on-change="changePage"
      show-elevator
      show-total
      style="padding-top:10px;"
    ></Page>
    <!-- 编辑弹窗 -->
    <el-dialog :visible.sync="editFormVisible" style="text-align: left" title="编辑">
      <Form
        :label-width="120"
        :model="editform"
        :rules="ruleInline"
        label-position="right"
        ref="editform"
      >
        <FormItem label="等级" prop="level">
          <InputNumber disabled  style="width:300px;" v-model="editform.level"/>
        </FormItem>
        <FormItem label="产品名称" prop="product">
          <!-- <Select
            v-model="editform.product"
            autocomplete="off"
            style="width:300px;"
            @on-change="changeEditProduct"
          >
            <Option :key="item.id" :value="item.id" v-for="item in products">{{ item.prod_name }}</Option>
          </Select>-->
          <Input disabled  style="width:300px;" v-model="editform.product" />
        </FormItem>
        <FormItem label="总收益" prop="up">
          <InputNumber
            placeholder="总收益不得高于推广价"
            style="width:300px;"
            v-model="editform.up"
          />
        </FormItem>
        <FormItem label="受邀人最低收益" prop="down">
          <InputNumber :max="editform.up"  style="width:300px;" v-model="editform.down" />
        </FormItem>
        <FormItem label="最小邀请人数" prop="min">
          <InputNumber disabled  style="width:300px;" v-model="editform.min" />
        </FormItem>
        <FormItem label="最大邀请人数" prop="max">
          <InputNumber aria-placeholder="总收益不得高于推广价" :min="editform.min"  style="width:300px;" v-model="editform.max" />
        </FormItem>
      </Form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button @click="editSubmit('editform')" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </Card>
</template>
<script>
export default {
  name: "people-set",
  data() {
    return {
      product:null,
      products: "",
      prod_id: "",
      addProd_id: "",
      editProd_id: "",
      // CateOpen_id:"",
      total: 1,
      currentPage: 1,
      // categorys: [
      //   {
      //     value: "beijing",
      //     label: "北京市"
      //   },
      //   {
      //     value: "shanghai",
      //     label: "上海市"
      //   },
      //   {
      //     value: "shenzhen",
      //     label: "深圳市"
      //   }
      // ],
      tableData: [],
      addFormVisible: false,
      addform: {
        level: null,
        productAdd: null,
        price: null, //产品推广价，up不能超过这个
        up: 0,
        down: 0,
        min: 0,
        max: 0
      },
      formLabelWidth: "120px",
      editFormVisible: false,
      editform: {
        level: null,
        product: null,
        up: 0,
        down: 0,
        min: 0,
        max: 0
      },
      ruleInline: {
        level: [
          {
            required: true,
            type: "number",
            message: "等级不能为空！",
            trigger: "blur"
          }
        ],
        productAdd:[
           {
            required: true,
            type: "number",
            message: "产品不能为空！",
            trigger: "blur"
          }
        ],
        product: [
          {
            required: true,
            message: "产品名称不能为空！",
            trigger: "blur"
          }
        ],
        up: [
          {
            required: true,
            type: "number",
            message: "收益上线不能为空！",
            trigger: "blur"
          }
        ],
        down: [
          {
            required: true,
            type: "number",
            message: "收益下线不能为空！",
            trigger: "blur"
          }
        ],
        min: [
          {
            required: true,
            type: "number",
            message: "最小邀请人数不能为空！",
            trigger: "blur"
          }
        ],
        max: [
          {
            required: true,
            type: "number",
            message: "最大邀请人数不能为空！",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 改变head的下拉框
    changeSelete(event) {
      console.log(this.globalVariable.getUserInfo().open_id);
      this.prod_id = event;
      this.getData();
      this.$axios
        .post("sysproduct/getById", {
          id: this.prod_id
        })
        .then(res => {
          console.log(res);
          this.editform.product = res.data.content.prod_name;
        });
    },
    // 获取列表
    getData() {
      this.$axios
        .post("/businesslevel/getList", {
          pageSize: 10,
          pageNum: this.currentPage,
          open_id: this.globalVariable.getUserInfo().open_id,
          prod_id: this.prod_id
        })
        .then(res => {
          // console.log(res);
          this.total = res.data.content.total;
          this.tableData = res.data.content.list;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 获取head的产品子类名称
    getProducts() {
      this.$axios
        .post("/sysproduct/getList", {
          product_type: 2
        })
        .then(res => {
          console.log(res);
          this.products = res.data.content.list;
        })
        .catch(error => {
          // console.log(error);
        });
    },
    // 获取产品大类
    // getCategory(){
    //   this.$axios
    //     .post("/sysproduct/getList", {
    //       product_type: 1,
    //     })
    //     .then(res => {
    //       // console.log(res);
    //       this.categorys=res.data.content.list;
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // },
    //产品大类的选择框的选择
    // changeCategory(event){
    //   console.log(event);
    //   this.CateOpen_id=event;
    // },
    //获取产品大类下的产品名称

    handleAdd() {
      this.addFormVisible = true;
      this.getProducts();
      // this.addform = {
      //   level: "",
      //   product: null,
      //   up: 0,
      //   down: 0,
      //   min: 0,
      //   max: 0
      // };
      this.addform.level = null;
      this.addform.productAdd = null;
      this.addform.up = null;
      this.addform.down = null;
      this.addform.min = null;
      this.addform.max = null;
    },
    // 改变新增的下拉框
    changeAddProduct(event) {
      console.log(event);
      this.addProd_id = event;
      this.getPrice();
    },
    //等级数据改变时触发
    levelChange() {
      // console.log("hhhhhh");
      this.getPrice();
    },
    //获取推广价和最低邀请人数
    getPrice() {
      this.$axios
        .post("/businesslevel/forSave", {
          open_id: this.globalVariable.getUserInfo().open_id,
          prod_id: this.addProd_id,
          lvl_number: this.addform.level
        })
        .then(res => {
          console.log(res);
          this.addform.price = res.data.content.tg_money;
          if (this.addform.level === 1) {
            this.addform.min = 0;
          } else {
            this.addform.min = res.data.content.number_low;
          }
        });
    },
    handleEdit(index, row) {
      console.log(index, row);
      this.editFormVisible = true;
      this.editform.level = row.lvl_number;
      this.editform.name = row.name;
      this.editform.up = row.lvl_money;
      this.editform.down = row.lvl_low;
      this.editform.min = row.lvl_start;
      this.editform.max = row.lvl_end;
    },
    changeEditProduct(event) {
      this.editProd_id = event;
    },
    addSubmit(name) {
      this.addFormVisible = false;
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$axios
            .post("/businesslevel/saveOne", {
              open_id: this.globalVariable.getUserInfo().open_id,
              prod_id: this.addProd_id,
              lvl_number: this.addform.level,
              lvl_money: this.addform.up,
              lvl_low: this.addform.down,
              lvl_start: this.addform.min,
              lvl_end: this.addform.max
            })
            .then(res => {
              // console.log(res)
              this.getData();
              this.$Message.success("添加成功");
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          this.addFormVisible = true;
          this.$Message.error("请检查表单的有效性");
        }
      });
    },
    editSubmit(name) {
      this.editFormVisible = false;
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$axios
            .post("/businesslevel/saveOne", {
              open_id: this.globalVariable.getUserInfo().open_id,
              prod_id: this.prod_id,
              lvl_number: this.editform.level,
              lvl_money: this.editform.up,
              lvl_low: this.editform.down,
              lvl_start: this.editform.min,
              lvl_end: this.editform.max
            })
            .then(res => {
              // console.log(res)
              this.getData();
              this.$Message.success("编辑成功");
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          this.editFormVisible = true;
          this.$Message.error("请检查表单的有效性");
        }
      });
    },
    changePage(event) {
      console.log(event);
      this.currentPage = parseInt(event) - 0;
    }
  },

  created() {
    this.getProducts();
  }
};
</script>
