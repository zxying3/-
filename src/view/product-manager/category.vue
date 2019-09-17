<template>
  <Card>
    <div slot="title" style="height:30px">
      <!-- <Icon type="md-cog"></Icon> -->
      产品大类信息总览
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
        <FormItem label="名称" prop="name">
          <Input v-model="addform.name" autocomplete="off" style="width:300px;" />
        </FormItem>
        <FormItem label="状态" prop="state">
          <RadioGroup v-model="addform.state">
            <Radio label="上架"></Radio>
            <Radio label="下架" disabled></Radio>
          </RadioGroup>
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
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="名称" prop="prod_name" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.prod_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status|filter }}</span>
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
        <FormItem label="名称" prop="name">
          <Input v-model="editform.name" autocomplete="off" style="width:300px;" />
        </FormItem>
        <FormItem label="状态" prop="state">
          <RadioGroup v-model="editform.state">
            <Radio label="上架"></Radio>
            <Radio label="下架"></Radio>
          </RadioGroup>
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
  name: "category",
  data() {
    return {
      searchValue: "",
      total: 0,
      currentPage: 1,
      tableData: [],
      ruleInline: {
        name: [
          { required: true, message: "产品名称不能为空", trigger: "blur" }
        ],
        state: [
          { required: true, message: "产品状态不能为空", trigger: "blur" }
        ]
      },
      addFormVisible: false,
      addform: {
        name: "",
        state: "上架"
      },
      editFormVisible: false,
      editform: {
        name: "",
        state: "",
        id: ""
      }
    };
  },
  filters: {
    filter(value) {
      if (value === 0) {
        return (value = "下架");
      } else if (value === 1) {
        return (value = "上架");
      }
    }
  },
  methods: {
    getData() {
      this.$axios
        .post("/sysproduct/getList", {
          product_type: 1,
          pageSize: 10,
          pageNum: this.currentPage
        })
        .then(res => {
          // console.log(res);
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
      // console.log(row.state)
      this.editFormVisible = true;
      this.editform.name = row.prod_name;
      this.editform.id = row.id;
      if (row.status === 1) {
        this.editform.state = "上架";
      } else {
        this.editform.state = "下架";
      }
    },
    handleDelete(index, row) {
      console.log(row);
      this.$Modal.confirm({
        title: "确认要删除吗",
        content: "",
        onOk: () => {
          this.$axios
            .post("/sysproduct/deleteById", {
              ids: row.id
            })
            .then(res => {
              // console.log(res.data.content)
              if (res.data.content === "请先删除所选类下的子类产品!") {
                this.$Message.info("请先删除所选类下的子类名称");
              } else {
                this.getData();
                this.$Message.success("删除成功");
              }
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
            .post("/sysproduct/saveOne", {
              prod_name: this.addform.name,
              product_type: 1
            })
            .then(res => {
              this.getData();
              this.$Message.success("已成功新增了一条数据");
            })
            .catch(err => {
              this.$Message.error("新增失败");
            });
        } else {
          this.$Message.error("请检查表单的有效性");
        }
      });
    },
    editSubmit(name) {
      this.editFormVisible = false;
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$axios
            .post("/sysproduct/updateById", {
              id: this.editform.id,
              prod_name: this.editform.name,
              status: this.editform.state === "上架" ? 1 : 0,
              product_type: 1
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
    },
    search() {
      this.$axios
        .post("/sysproduct/getList", {
          prod_name: this.searchValue,
          product_type: 1
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
    // 获取表格数据
    this.getData();
  }
};
</script>

<style scoped>
</style>
