<template>
  <Card>
    <div slot="title" style="height:30px">
      <!-- <Icon type="md-cog"></Icon> -->
      客服中心
      <Button type="primary" @click="handleAdd" style="float:right;margin-left:10px">新增</Button>
    </div>
    <!-- 新增弹窗 -->
    <el-dialog title="新增" :visible.sync="addFormVisible" style="text-align: left">
      <Form ref="formInline" label-position="right" :label-width="120" :model="addform">
        <FormItem label="微信">
          <Input v-model="addform.wx" autocomplete="off" style="width:300px;" />
        </FormItem>
        <FormItem label="QQ">
          <Input v-model="addform.QQ" autocomplete="off" style="width:300px;" />
        </FormItem>
        <FormItem label="微信手机号">
          <Input v-model="addform.wxPhone" autocomplete="off" style="width:300px;" />
        </FormItem>
        <FormItem label="服务电话1">
          <Input v-model="addform.phone1" autocomplete="off" style="width:300px;" />
        </FormItem>
        <FormItem label="服务电话2">
          <Input v-model="addform.phone2" autocomplete="off" style="width:300px;" />
        </FormItem>
        <FormItem label="服务内容">
          <Input v-model="addform.content" autocomplete="off" style="width:300px;" />
        </FormItem>
      </Form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
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

      <el-table-column label="微信" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.wechart }}</span>
        </template>
      </el-table-column>
      <el-table-column label="QQ" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.qq }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.wx_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务电话1" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务电话2" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务内容" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑弹窗 -->
    <el-dialog title="编辑" :visible.sync="editFormVisible" style="text-align: left">
      <Form ref="editFormInline" label-position="right" :label-width="120" :model="editform">
        <FormItem label="微信">
          <Input v-model="editform.wx" autocomplete="off" style="width:300px;" />
        </FormItem>
        <FormItem label="QQ">
          <Input v-model="editform.QQ" autocomplete="off" style="width:300px;" />
        </FormItem>
        <FormItem label="微信手机号">
          <Input v-model="editform.wxPhone" autocomplete="off" style="width:300px;" />
        </FormItem>
        <FormItem label="服务电话1">
          <Input v-model="editform.phone1" autocomplete="off" style="width:300px;" />
        </FormItem>
        <FormItem label="服务电话2">
          <Input v-model="editform.phone2" autocomplete="off" style="width:300px;" />
        </FormItem>
        <FormItem label="服务内容">
          <Input v-model="editform.content" autocomplete="off" style="width:300px;" />
        </FormItem>
      </Form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </Card>
</template>

<script>
export default {
  name: "service",
  data() {
    return {
      tableData: [],
      // ruleInline: {
      //   name: [
      //     { required: true, message: "产品名称不能为空", trigger: "blur" }
      //   ],
      //   state: [
      //     { required: true, message: "产品状态不能为空", trigger: "blur" }
      //   ]
      // },
      addFormVisible: false,
      addform: {
        wx: "",
        QQ: "",
        wxPhone: "",
        phone1: "",
        phone2: "",
        content: ""
      },
      editFormVisible: false,
      editform: {
        id: null,
        wx: "",
        QQ: "",
        wxPhone: "",
        phone1: "",
        phone2: "",
        content: ""
      }
    };
  },
  methods: {
    getData() {
      this.$axios
        .post("/sysservice/getList", {
          open_id: this.globalVariable.getUserInfo().open_id
        })
        .then(res => {
          console.log(res);
          this.tableData = res.data.content;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleAdd() {
      this.addFormVisible = true;
      this.addform = {
        wx: "",
        QQ: "",
        wxPhone: "",
        phone1: "",
        phone2: "",
        content: ""
      };
    },
    handleEdit(index, row) {
      console.log(index, row);
      this.editFormVisible = true;
      this.editform = {
        id: row.id,
        wx: row.wechart,
        QQ: row.qq,
        wxPhone: row.wx_id,
        phone1: row.phone1,
        phone2: row.phone2,
        content: row.content
      };
    },
    handleDelete(index, row) {
      this.$Modal.confirm({
        title: "确认要删除吗",
        content: "",
        onOk: () => {
          this.$axios
            .post("/sysservice/deleteById", {
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
    addSubmit() {
      this.$axios
        .post("/sysservice/saveOne", {
          open_id: this.globalVariable.getUserInfo().open_id,
          phone1: this.addform.phone1,
          phone2: this.addform.phone2,
          wechart: this.addform.wx,
          qq: this.addform.QQ,
          wx_id: this.addform.wxPhone,
          content: this.addform.content
        })
        .then(res => {
          this.getData();
          this.addFormVisible = false;
          this.$Message.success("已成功新增了一条数据");
        })
        .catch(err => {
          this.$Message.error("新增失败");
        });
    },
    editSubmit() {
      this.editFormVisible = false;

      this.$axios
        .post("/sysservice/updateById", {
          id: this.editform.id,
          open_id: this.globalVariable.getUserInfo().open_id,
          phone1: this.editform.phone1,
          phone2: this.editform.phone2,
          wechart: this.editform.wx,
          qq: this.editform.QQ,
          wx_id: this.editform.wxPhone,
          content: this.editform.content
        })
        .then(res => {
          this.getData();
          this.$Message.success("编辑成功");
          this.editFormVisible = false;
        })
        .catch(error => {
          console.log(error);
        });
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
