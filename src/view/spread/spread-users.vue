<template>
  <Card>
    <div slot="title" style="height:30px">
      推广用户信息总览
      <div style="display:inline-block; float:right">
        <i-input placeholder="请输入姓名或手机号" v-model="searchValue" style="width: 200px"></i-input>
        <i-button type="primary" style="width:50px" @click="search">搜索</i-button>
      </div>
      <!-- <Select placeholder="请选择用户类型" v-model="selete" style="width:150px;float:right;margin-right:10px">
        <Option value="全部">全部</Option>
        <Option value="游客">游客</Option>
        <Option value="个人">个人</Option>
        <Option value="商户">商户</Option>
        <Option value="代理商">代理商</Option>
      </Select>-->
    </div>
    <!-- table -->
    <el-table
      empty-text="暂无数据"
      :data="tableData"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      style="width: 100%;overflow:auto;"
    >
      <el-table-column label="序号" align="center" width="55">
        <template slot-scope="scope">
          <span>{{ (scope.$index)+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.wx_nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.user_account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户类型" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.user_type|filter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等级" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.level_number }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="头像" align="center" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.headerImage" style="max-height: 50px;max-width: 130px margin-top:20px;"/>
        </template>
      </el-table-column>-->
      <!-- <el-table-column label="账号" align="center" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.web_account}}</span>
        </template>
      </el-table-column>-->
      <!-- <el-table-column label="密码" align="center" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.password"></el-input>
        </template>
      </el-table-column>-->
      <el-table-column label="钱包" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.user_profit2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推广收益" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.user_profit1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提现金额" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.user_tocash }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邀请人数 " align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.invite_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="二维码" align="center" width="100">
        <template slot-scope="scope">
          <el-popover placement="left" title trigger="hover">
            <img :src="scope.row.share_url" style="max-height: 400px;max-width: 400px" />
            <img
              slot="reference"
              :src="scope.row.share_url"
              :alt="scope.row.share_url"
              style="max-height: 50px;max-width: 130px margin-top:20px;"
            />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.rzTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上次登录时间" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.lastTime }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column fixed="right" label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button size="small" type="text">保存</el-button>
          <el-button size="small" type="text" @click="handleView(scope.$index, scope.row)">查看</el-button>
        </template>
      </el-table-column>-->
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
    <el-dialog
      title="认证详情"
      :visible.sync="viewFormVisible"
      style="text-align: left;border-bottom:1px solid #333"
    >
      <el-form :model="viewform">
        <el-form-item label="名称" label-width="120px">
          <span></span>
        </el-form-item>
        <el-form-item label="推广价" label-width="120px">
          <span></span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </Card>
</template>

<script>
export default {
  name: "spread-users",
  data() {
    return {
      selete: "",
      searchValue: "",
      total: 5,
      currentPage: 1,
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
      if (value === 1) {
        return (value = "个人");
      }
    }
  },
  methods: {
    getAll() {
      this.$axios
        .post("/sysusers/getList", {
          user_type: 1,
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
    handleView(index, row) {
      //   console.log(index, row);
      this.viewFormVisible = true;
    },
    changePage(event) {
      console.log(event);
      this.currentPage = parseInt(event) - 0;
    },
    search() {
      this.$axios
        .post("/sysusers/getList", {
          wx_nickname: this.searchValue,
          user_type: 1
        })
        .then(res => {
          console.log(res);
          if (res.data.content.list) {
            this.total = res.data.content.total;
            this.tableData = res.data.content.list;
            this.searchValue = "";
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    this.getAll();
  }
};
</script>
