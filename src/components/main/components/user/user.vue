<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <!-- <Badge :dot="!!messageUnreadCount">
        <Avatar :src="userAvatar"/>
      </Badge>-->
      <a>{{this.globalVariable.getUserInfo().wx_nickname}}</a>
      <img class="headImg" :src="headImage" />
      
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <!-- <DropdownItem name="message">
          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem>-->
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
// import lunbo1 from "@/assets/images/lunbo1.png";
import "./user.less";
import { mapActions } from "vuex";
export default {
  name: "User",
  props: {
    userAvatar: {
      type: String,
      default: ""
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      headImage:null
    };
  },
  methods: {
    ...mapActions(["handleLogOut"]),
    logout() {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: "login"
        });
        this.globalVariable.setUserInfo({});
      });
    },
    // logout (){
    //   this.$router.push({
    //       name: 'login'
    //     })
    // },
    handleClick(name) {
      switch (name) {
        case "logout":
          this.logout();
          break;
        case "message":
          this.message();
          break;
      }
    }
  },
  created(){
    this.headImage=this.globalVariable.getUserInfo().wx_avatarurl;
  }
};
</script>
<style scoped>
  .headImg{
    height:50px;
    width:50px;
    border-radius:50%;
  }
</style>

