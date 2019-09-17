<template>
  <Card>
    <div slot="title">个人信息总览</div>
    <!-- table -->
    <el-table
      empty-text="暂无数据"
      :data="tableData"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      style="width: 100%"
    >
      <el-table-column label="账号" align="center" prop="web_account" width="80"></el-table-column>
      <el-table-column label="密码" align="center" prop="web_password" width="80"></el-table-column>
      <el-table-column label="昵称" align="center" prop="wx_nickname"></el-table-column>
      <el-table-column label="手机号" align="center" prop="user_account" width="110"></el-table-column>
      <el-table-column label="用户状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user_status|filterStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user_type|filterType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推广收益" align="center" prop="user_profit1"></el-table-column>
      <el-table-column label="冻结推广收益" align="center" prop="user_profit1_lock"></el-table-column>
      <el-table-column label="余额" align="center" prop="user_profit2"></el-table-column>
      <el-table-column label="冻结余额" align="center" prop="user_profit2_lock"></el-table-column>
      <el-table-column label="提现金额" align="center" prop="user_tocash"></el-table-column>
      <el-table-column label="注册时间" align="center" prop="rzTime"></el-table-column>
      <el-table-column label="二维码" align="center" prop="user_share_code"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹窗 -->
    <el-dialog title="编辑" :visible.sync="editFormVisible" style="text-align: left">
      <Form ref="editform" label-position="right" :label-width="120" :model="editform">
        <FormItem label="密码">
          <Input v-model="editform.password" autocomplete="off" style="width:300px;" />
        </FormItem>
        <FormItem label="昵称">
          <Input v-model="editform.name" autocomplete="off" style="width:300px;" />
        </FormItem>
      </Form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </Card>
</template>

<script>
export default {
  name: "my",
  data() {
    return {
      tableData: null,
      editFormVisible: false,
      editform: {
        id: null,
        password: "",
        name: ""
      }
    };
  },
  filters: {
    filterStatus(value) {
      if (value === 0) {
        return (value = "未认证");
      } else if (value === 1) {
        return (value = "认证");
      }
    },
    filterType(value) {
      if (value === 0) {
        return (value = "游客");
      } else if (value === 1) {
        return (value = "个人");
      } else if (value === 2) {
        return (value = "代理商");
      } else if (value === 3) {
        return (value = "商户");
      } else if (value === 4) {
        return (value = "服务商");
      }
    }
  },
  methods: {
    // 获取列表
    getData() {
      this.$axios
        .post("/sysusers/getById", {
          open_id: this.globalVariable.getUserInfo().open_id
        })
        .then(res => {
          console.log(res);
          // let data = res.data.content;
          // this.tableData.push(data);
          // console.log(this.tableData);
          this.tableData = res.data.content;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleEdit(index, row) {
      // console.log(index, row);
      this.editFormVisible = true;
      this.editform.password = row.web_password;
      (this.editform.name = row.wx_nickname), (this.editform.id = row.id);
    },
    editSubmit() {
      this.$axios
        .post("/sysusers/updateById", {
          id: this.editform.id,
          web_password: this.editform.password,
          wx_nickname: this.editform.name
        })
        .then(res => {
          this.$Message.success("编辑成功");
          this.getData();
          this.editFormVisible = false;
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
