<template>
  <Card>
    <div slot="title" style="height:30px">
      申请列表总览
      <Button type="primary" style="float:right; margin-left:10px">导出</Button>
      <div style="display:inline-block; float:right">
        <i-input placeholder="请输入名称" v-model="searchValue" style="width: 200px"></i-input>
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
      <el-table-column label="序号" align="center">
        <template slot-scope="scope">
          <span>{{ (scope.$index)+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.merc_phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="银行名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bank_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="pos机" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pay_pos|filter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pay_wx|filter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付宝" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pay_zfb|filter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="云闪付 " align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pay_ysf|filter }}</span>
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
  </Card>
</template>

<script>
export default {
  name: "business-list",
  data() {
    return {
      searchValue: "",
      total: 0,
      currentPage: 1,
      tableData: []
    };
  },
  filters: {
    filter(value) {
      if (value === 0) {
        return (value = "否");
      } else if (value === 1) {
        return (value = "是");
      }
    }
  },
  methods: {
    getData() {
      this.$axios
        .post("/shop/getList", {
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
    search() {
      this.$axios
        .post("/shop/getList", {
          merc_phone: this.searchValue
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

<style scoped>
.add-button {
  margin-top: 10px;
  margin-bottom: 10px;
  padding-left: 10px;
  border-bottom: 1px solid #dce1e5;
}
</style>
