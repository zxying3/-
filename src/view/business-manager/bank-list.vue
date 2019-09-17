<template>
  <Card>
    <div slot="title" style="height:30px">
      银行列表总览
      <Button type="primary" style="float:right; margin-left:10px">导出</Button>
      <Button type="primary" @click="handleAdd" style="float:right;margin-left:10px">新增</Button>
      <div style="display:inline-block; float:right">
        <i-input placeholder="请输入名称" v-model="searchValue" style="width: 200px"></i-input>
        <i-button type="primary" style="width:50px" @click="search">搜索</i-button>
      </div>
    </div>
    <!-- 新增弹窗 -->

    <el-dialog title="新增" :visible.sync="addFormVisible" style="text-align: left">
      <Form
        ref="formInline"
        label-position="right"
        :label-width="120"
        :model="addform"
        :rules="ruleInline"
      >
        <FormItem label="银行名称" prop="name">
          <Input v-model="addform.name" autocomplete="off" style="width:300px;" />
        </FormItem>
      </Form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit('formInline')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- table -->
    <el-table
      empty-text="暂无数据"
      :data="tableData"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      style="width: 100%"
    >
      <el-table-column label="序号" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ (scope.$index)+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="银行名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bank_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- table-footer -->
    <Page
      :total="total"
      :current="currentPage"
      show-total
      show-elevator
      @on-change="changePage"
      style="padding-top:10px;"
    ></Page>

    <!-- 编辑弹窗 -->
    <el-dialog title="编辑" :visible.sync="editFormVisible" style="text-align: left">
      <Form
        ref="editFormInline"
        label-position="right"
        :label-width="120"
        :model="editform"
        :rules="ruleInline"
      >
        <FormItem label="产品名称" prop="name">
          <Input v-model="editform.name" autocomplete="off" style="width:300px;" />
        </FormItem>
      </Form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit('editFormInline')">确 定</el-button>
      </div>
    </el-dialog>
  </Card>
</template>

<script>
export default {
  name: "bank-list",
  data() {
    return {
      searchValue: "",
      total: null,

      currentPage: 1,
      tableData: [],
      addFormVisible: false,
      addform: {
        name: ""
      },
      formLabelWidth: "120px",
      editFormVisible: false,
      editform: {
        name: "",
        id: ""
      },
      ruleInline: {
        name: [{ required: true, message: "产品名称不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    getData() {
      this.$axios
        .post("/businessbank/getList", {
          pageSize: 10,
          pageNum: this.currentPage
        })
        .then(res => {
          console.log(res);
          if (res.data.content.list !== []) {
            this.total = res.data.content.total;
            this.tableData = res.data.content.list;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleAdd() {
      this.addFormVisible = true;
      this.addform.name = "";
    },
    handleEdit(index, row) {
      // console.log(index, row);
      this.editFormVisible = true;
      this.editform.name = row.bank_name;
      this.editform.id = row.id;
    },
    handleDelete(index, row) {
      this.$Modal.confirm({
        title: "确认要删除吗",
        content: "",
        onOk: () => {
          this.$axios
            .post("/businessbank/deleteById", {
              ids: row.id
            })
            .then(res => {
              this.getData();
              this.$Message.success("删除成功");
            })
            .catch(err => {
              this.$Message.error("删除失败");
            });
        },
        onCancel: () => {
          // this.$Message.info("取消删除");
        }
      });
    },

    addSubmit(name) {
      this.addFormVisible = false;
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$axios
            .post("/businessbank/saveOne", {
              bank_name: this.addform.name
            })
            .then(res => {
              this.getData();
              this.$Message.success("已成功新增了一条数据");
            })
            .catch(err => {
              this.$Message.error("新增失败");
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
            .post("/businessbank/updateById", {
              id: this.editform.id,
              bank_name: this.editform.name
            })
            .then(res => {
              this.$Message.success("编辑成功");
              this.editFormVisible = false;
              this.getData();
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          this.editFormVisible = true;
          this.$Message.error("请检查表单的有效性");
        }
      });

      // this.$axios.put('url',{
      //     date:this.editform.date,
      //     name:this.editform.name
      // })
      // .then(res=>{

      // })
      // .catch(error=>{
      //     console.log(error)
      // })
    },
    search() {
      this.$axios
        .post("/businessbank/getList", {
          bank_name: this.searchValue
        })
        .then(res => {
          // console.log(this.searchValue);
          this.total = res.data.content.total;
          this.tableData = res.data.content.list;
          this.searchValue = "";
        })
        .catch(error => {
          console.log(error);
        });
    },
    changePage(event) {
      console.log(event);
      this.currentPage = parseInt(event) - 0;
    }
  },

  created() {
    this.getData();
  }
};
</script>
