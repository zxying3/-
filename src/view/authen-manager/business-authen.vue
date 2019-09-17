<template>
  <Card>
    <!-- selete选择器 -->
    <div slot="title" style="margin-right:100px;">
      代理商认证信息
      <Select v-model="seleteOption" style="width:100px" @on-change="changeSelete($event)">
        <Option value="全部">全部</Option>
        <Option value="已通过">已通过</Option>
        <Option value="未通过">未通过</Option>
        <Option value="待审核">待审核</Option>
      </Select>
      <Button type="primary" style="float:right; margin-left:10px">导出</Button>
      <div style="display:inline-block; float:right">
        <i-input placeholder="请输入姓名、手机号或门店名称" v-model="searchValue" style="width: 200px"></i-input>
        <i-button type="primary" style="width:50px" @click="search">搜索</i-button>
      </div>
    </div>

    <!-- table -->
    <el-table
      empty-text="暂无数据"
      :data="tableData"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      style="width: 100%"
    >
      <el-table-column label="法人姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bus_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号" align="center" width="120">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.phone }}</span> -->
          <Input :disabled="scope.row.approve_status!==1" v-model="scope.row.web_account" />
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="门店名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.store_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="门店地址" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.store_address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="营业执照" align="center">
        <template slot-scope="scope">
          <el-popover placement="left" title trigger="hover">
            <img :src="scope.row.store_license" style="max-height: 400px;max-width: 400px" />
            <img
              slot="reference"
              :src="scope.row.store_license"
              :alt="scope.row.store_license"
              style="max-height: 50px;max-width: 130px margin-top:20px;"
            />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="身份证" align="center" width="250">
        <template slot-scope="scope">
          <el-popover placement="left" title trigger="hover">
            <img :src="scope.row.idcard_before" style="max-height: 400px;max-width: 400px" />
            <img
              slot="reference"
              :src="scope.row.idcard_before"
              :alt="scope.row.idcard_before"
              style="max-height: 50px;max-width: 130px margin-top:20px;margin-right:40px"
            />
          </el-popover>
          <el-popover placement="left" title trigger="hover">
            <img :src="scope.row.idcard_back" style="max-height: 400px;max-width: 400px" />
            <img
              slot="reference"
              :src="scope.row.idcard_back"
              :alt="scope.row.idcard_back"
              style="max-height: 50px;max-width: 130px margin-top:20px;"
            />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="审核状态 " align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.approve_status|filter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230px">
        <template slot-scope="scope">
          <!-- <el-button size="mini" @click="handleView(scope.$index, scope.row)">查看</el-button> -->
          <el-button
            v-if="scope.row.approve_status!==1"
            size="mini"
            @click="handlePass(scope.$index, scope.row)"
          >通过</el-button>
          <el-button v-if="scope.row.approve_status==1" size="mini" @click="save(scope.row)">保存</el-button>
          <el-button
            v-if="scope.row.approve_status!==2"
            size="mini"
            type="danger"
            @click="handleFail(scope.$index, scope.row)"
          >拒绝</el-button>
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

    <!-- 查看弹窗 -->
    <!-- <el-dialog title="商户详情" :visible.sync="viewFormVisible" style="text-align: left;border-bottom:1px solid #333">
      <el-form :model="viewform">
        <el-form-item label="名称：" label-width="120px">
          <span></span>
        </el-form-item>
        <el-form-item label="推广价：" label-width="120px">
          <span></span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>-->
  </Card>
</template>

<script>
export default {
  name: "business-authen",
  data() {
    return {
      searchValue: "",
      total: 4,
      currentPage: 1,
      seleteOption: "全部",
      tableData: [],
      viewFormVisible: false,
      viewform: {
        name: "",
        price: "",
        state: ""
      }
    };
  },
  filters: {
    filter(value) {
      if (value === 0) {
        return (value = "待审核");
      } else if (value === 1) {
        return (value = "已通过");
      } else if (value === 2) {
        return (value = "未通过");
      }
    }
  },
  methods: {
    changeSelete(event) {
      console.log(event);
      switch (event) {
        case "全部":
          this.getAll();
          break;
        case "已通过":
          this.getPass();
          break;
        case "未通过":
          this.getFail();
          break;
        case "待审核":
          this.getCheck();
          break;
      }
    },
    getAll() {
      // console.log("hahah");
      this.$axios
        .post("/businessunit/getList", {
          approve_type: 2,
          approve_status: -1,
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
    getPass() {
      this.$axios
        .post("/businessunit/getList", {
          approve_type: 2,
          approve_status: 1,
          pageSize: 10,
          pageNum: this.currentPage
        })
        .then(res => {
          // console.log(res);
          if (res) {
            this.total = res.data.content.total;
            this.tableData = res.data.content.list;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getFail() {
      this.$axios
        .post("/businessunit/getList", {
          approve_type: 2,
          approve_status: 2,
          pageSize: 10,
          pageNum: this.currentPage
        })
        .then(res => {
          if (res) {
            this.total = res.data.content.total;
            this.tableData = res.data.content.list;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getCheck() {
      this.$axios
        .post("/businessunit/getList", {
          approve_type: 2,
          approve_status: 0,
          pageSize: 10,
          pageNum: this.currentPage
        })
        .then(res => {
          if (res) {
            this.total = res.data.content.total;
            this.tableData = res.data.content.list;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleView(index, row) {
      //   console.log(index, row);
      this.viewFormVisible = true;
    },
    handlePass(index, row) {
      // console.log(row);
      this.$axios
        .post("/businessunit/updateById", {
          open_id: row.open_id,
          id: row.id,
          approve_status: 1
        })
        .then(res => {
          // console.log(this.seleteOption)
          switch (this.seleteOption) {
            case "全部":
              this.getAll();
              break;
            case "待审核":
              this.getCheck();
              break;
            case "已通过":
              this.getPass();
              break;
            case "未通过":
              this.getFail();
              break;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleFail(index, row) {
      // console.log(row);
      this.$axios
        .post("/businessunit/updateById", {
          open_id: row.open_id,
          id: row.id,
          approve_status: 2
        })
        .then(res => {
          // console.log(this.seleteOption)
          switch (this.seleteOption) {
            case "全部":
              this.getAll();
              break;
            case "待审核":
              this.getCheck();
              break;
            case "已通过":
              this.getPass();
              break;
            case "未通过":
              this.getFail();
              break;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    save(row) {
      console.log(row);
      this.$axios
        .post("/businessunit/updateById", {
          open_id: row.open_id,
          web_account: row.web_account
        })
        .then(res => {
          switch (this.seleteOption) {
            case "全部":
              this.getAll();
              break;
            case "待审核":
              this.getCheck();
              break;
            case "已通过":
              this.getPass();
              break;
            case "未通过":
              this.getFail();
              break;
          }
          this.$Message.success("保存成功");
        });
    },
    search() {
      this.$axios
        .post("/businessunit/getList", {
          phone: this.searchValue,
          approve_type: 2
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
      // console.log(event);
      this.currentPage = parseInt(event) - 0;
    }
  },
  created() {
    this.getAll();
  }
};
</script>
