<template>
  <Card>
    <div slot="title" style="height:30px">
      <!-- <Icon type="md-cog"></Icon> -->
      订单列表总览
      <Button type="primary" style="float:right; margin-left:10px">导出</Button>
      <!-- <div style="display:inline-block; float:right">
        <i-input placeholder="请输入名称" style="width: 200px"></i-input>
        <i-button type="primary" style="width:50px">搜索</i-button>
      </div>-->
      <Select
        @on-change="changeSelete($event)"
        placeholder="请选择产品名称"
        style="width:200px"
        v-model="product"
      >
        <Option :key="item.id" :value="item.id" v-for="item in products">{{ item.prod_name }}</Option>
      </Select>
    </div>

    <!-- table -->
    <el-table
      empty-text="暂无数据"
      :data="tableData"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <!-- <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user_phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="邀请人姓名" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="邀请人手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.invit_phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单时间" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="导入时间" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.import_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleView(scope.$index, scope.row)">查看</el-button>
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
    <el-dialog title="查看订单详细" :visible.sync="editFormVisible" style="text-align: left">
      <div class="title">
        <span>
          电话：
          <span>{{phone}}</span>
        </span>
      </div>
      <Timeline style="margin-top:20px">
        <Timeline-item v-for="item in order" :key="item.id">
          <p class="time">{{item.creat_time}}</p>
          <p class="content">{{item.orders_status}}</p>
        </Timeline-item>
        <!-- <Timeline-item>
          <p class="time">1984年</p>
          <p class="content">发布 Macintosh</p>
        </Timeline-item>
        <Timeline-item>
          <p class="time">2007年</p>
          <p class="content">发布 iPhone</p>
        </Timeline-item>
        <Timeline-item>
          <p class="time">2010年</p>
          <p class="content">发布 iPad</p>
        </Timeline-item>
        <Timeline-item>
          <p class="time">2011年10月5日</p>
          <p class="content">史蒂夫·乔布斯去世</p>
        </Timeline-item> -->
      </Timeline>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </Card>
</template>

<script>
export default {
  name: "order",
  data() {
    return {
      order:[],
      prod_id: null,
      product:'',
      products: null,
      phone:null,
      dates:null,
      status:null,
      total: null,
      currentPage: 1,
      tableData: [],
      editFormVisible: false
    };
  },
  methods: {
    // 改变head的下拉框
    changeSelete(event) {
      this.prod_id = event;
      this.getData();
    },
    // 获取产品名称
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
    // 获取列表
    getData() {
      this.$axios
        .post("/excel/getList", {
          order_type: 3,
          open_id: this.globalVariable.getUserInfo().open_id,
          prod_id: this.prod_id,
          pageSize:10,
          pageNum:this.currentPage
        })
        .then(res => {
          console.log(res);
          this.total=res.data.content.total;
          this.tableData = res.data.content.list;
        })
        .catch(res => {
          console.log(res);
        });
    },
    handleView(index, row) {
      console.log(index, row);
      this.editFormVisible = true;
      this.phone=row.user_phone
      this.order=row.ordersProfits
      console.log(this.order)

    },
    changePage(event) {
      // this.currentPage = event;
      console.log(event);
      this.currentPage = parseInt(event) - 0;
    }
  },
  created() {
    this.getProducts();
  }
};
</script>
<style scoped>
.title span {
  font-size: 18px;
}
</style>