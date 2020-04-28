<template>
  <div id="main" v-if="ifShow">
    <section class="post">
      <h3>欢迎您，{{userItem.name}}</h3>
      <ul class="actions fit" v-if="userItem.type == 4">
        <li><a @click="changeTab(1)" v-bind:class="buttonOneClass">信息修改</a></li>
        <li><a @click="changeTab(2)" v-bind:class="buttonTwoClass">增加职业</a></li>
        <li><a @click="changeTab(3)" v-bind:class="buttonThrClass">认证账号</a></li>
      </ul>
      <div class="box" v-if="buttonOneClass == 'button special fit'">
        <form class="alt" v-if="showMsg">
          <div class="row uniform">
            <div class="6u$ 12u$(xsmall)">
              <label for="nike">昵称</label>
              <input type="text" placeholder="请输入您的昵称" v-model="userMsg.nike" />
            </div>
            <div class="6u$ 12u$(xsmall)">
              <label for="phone">电话</label>
              <input type="text" placeholder="请输入您的电话" v-model="userMsg.phone" />
            </div>
            <div class="6u$ 12u$(xsmall)">
              <label for="mail">邮箱</label>
              <input type="text" placeholder="请输入您的邮箱" v-model="userMsg.mail" />
            </div>
            <ul class="actions small">
              <li><input type="submit" v-on:click="seeMsg()" value="取消" /></li>
              <li><input type="submit" v-on:click="changeMsg()" value="确认修改" /></li>
            </ul>
          </div>
        </form>
        <form class="alt" v-else-if="showPwd">
          <div class="row uniform">
            <div class="6u$ 12u$(xsmall)">
              <label for="password">旧密码</label>
              <input type="password" placeholder="请输入您的旧密码" v-model="userPwd.name" />
            </div>
            <div class="6u$ 12u$(xsmall)">
              <label for="password">新密码</label>
              <input type="password" placeholder="请输入您的新密码" v-model="userPwd.password" />
            </div>
            <ul class="actions small">
              <li><input type="submit" v-on:click="seePwd()" value="取消" /></li>
              <li><input type="submit" v-on:click="changePwd()" value="确认修改" /></li>
            </ul>
          </div>
        </form>
        <div v-else>
          <ul>
            <li>账号：{{userItem.number}}</li>
            <li v-if="userItem.type == 1">身份：学生</li>
            <li v-else-if="userItem.type == 2">身份：老师</li>
            <li v-else-if="userItem.type == 3">身份：企业</li>
            <li v-else>身份：超级管理员</li>
            <li>姓名：{{userItem.name}}
              <strong><sup v-if="userItem.isChecked == 1">已认证</sup></strong>
              <strong><sup v-if="userItem.isChecked == 2">认证中</sup></strong>
            </li>
            <li>昵称：{{userItem.nike}}</li>
            <li>专业：{{userItem.major}}</li>
            <li>班级：{{userItem.className}}</li>
            <li>电话：{{userItem.phone}}</li>
            <li>邮箱：{{userItem.mail}}</li>
          </ul>
          <ul class="actions small">
            <li><input type="submit" @click="seeMsg()" value="修改信息" /></li>
            <li><input type="submit" @click="seePwd()" value="修改密码" /></li>
            <li v-if="userItem.isChecked == 0"><input type="submit" @click="sendCheck(2,userItem.id)" value="请求认证" /></li>
          </ul>
        </div>
      </div>
      <div class="box" v-if="buttonTwoClass == 'button special fit'">
        <form class="alt">
          <div class="row uniform">
            <div class="6u$ 12u$(xsmall)">
              <label for="vocationId">所属行业</label>
              <div class="select-wrapper">
                <select v-model="userOcc.vocationId">
                  <option value="">-请选择行业-</option>
                  <option v-for="v in vocations" :value="v.id">{{v.name}}</option>
                </select>
              </div>
            </div>
            <div class="6u$ 12u$(xsmall)">
              <label for="phone">职业名称</label>
              <input type="text" placeholder="请输入该职业的名称" v-model="userOcc.name" />
            </div>
            <ul class="actions small">
              <li><input type="submit" @click="addOccupation()" value="确认添加" /></li>
            </ul>
          </div>
        </form>
      </div>
      <div class="box" v-if="buttonThrClass == 'button special fit'">
        <form class="alt">
          <div class="row uniform">
            <div class="6u 12u$(xsmall)">
              <input type="text" placeholder="请输入您要认证的账号" v-model="searchNumber" />
            </div>
            <div class="6u$ 12u$(xsmall)">
              <ul class="actions small">
                <li><input type="submit" @click="searchUser()" value="搜索账号" /></li>
              </ul>
            </div>
          </div>
        </form>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>账号</th>
                <th>姓名</th>
                <th>班级</th>
                <th>联系电话</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in unCheckedUser" :id="item.id">
                <td>{{item.number}}</td>
                <td @click="showUserDetail(item)"><strong>{{item.name}}</strong></td>
                <td>{{item.major}}{{item.className}}</td>
                <td>{{item.phone}}</td>
                <td v-if="item.isChecked == 1">
                  <a class="button small special disabled">已认证</a>
                </td>
                <td v-else>
                  <ul class="icons alt">
                    <li><a class="icon alt fa-check" @click="sendCheck(1,item.id)"><span class="label">认证</span></a></li>
                    <li><a class="icon alt fa-close" @click="sendCheck(0,item.id)"><span class="label">驳回</span></a></li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="showSearch">
          <ul>
            <li>账号：{{searchItem.number}}</li>
            <li v-if="searchItem.type == 1">身份：学生</li>
            <li v-else-if="searchItem.type == 2">身份：老师</li>
            <li v-else-if="searchItem.type == 3">身份：企业</li>
            <li v-else>身份：超级管理员</li>
            <li>姓名：{{searchItem.name}}</li>
            <li>昵称：{{searchItem.nike}}</li>
            <li>专业：{{searchItem.major}}</li>
            <li>班级：{{searchItem.className}}</li>
            <li>电话：{{searchItem.phone}}</li>
            <li>邮箱：{{searchItem.mail}}</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name: "User",
    data() {
      return {
        ifShow: true,
        buttonOneClass: 'button special fit',
        buttonTwoClass: 'button fit',
        buttonThrClass: 'button fit',
        userItem: {},
        vocations: [],
        unCheckedUser: [],
        userMsg: {
          nike: '',
          phone: '',
          mail: ''
        },
        userPwd: {
          name: '',
          password: ''
        },
        userOcc: {
          name: '',
          vocationId: ''
        },
        searchNumber: '',
        searchItem: {},
        showMsg: false,
        showPwd: false,
        showSearch: false,
        getUserUrl: "http://localhost:8090/user",
        getCheckedUserUrl: "http://localhost:8090/user/check/list",
        getAllVocationsUrl: "http://localhost:8090/vocation",
        addOccupationUrl: "http://localhost:8090/occupation",
        searchUserUrl: "http://localhost:8090/user/check",
        changeMsgUrl: "http://localhost:8090/user/msg",
        changePwdUrl: "http://localhost:8090/user/pwd"
      }
    },
    created: function() {
      if (this.$cookies.isKey('user')) {
        this.getUser()
        this.getVocations()
        this.getCheckedUser()
      } else {
        this.ifShow = false
      }
    },
    methods: {
      changeTab(type) {
        this.buttonOneClass = this.buttonTwoClass = this.buttonThrClass = 'button fit'
        switch (type) {
          case 1:
            this.buttonOneClass = 'button special fit'
            break;
          case 2:
            this.buttonTwoClass = 'button special fit'
            break;
          case 3:
            this.buttonThrClass = 'button special fit'
            this.showSearch = false
        }
      },
      getUser() {
        var vm = this
        $.ajax({
          type: "GET",
          dataType: "json",
          url: vm.getUserUrl,
          async: false,
          data: {
            'id': vm.$cookies.get('user').id
          },
          success: function(data) {
            if (data.Status == 200) {
              vm.userItem = data.msg
            } else {
              alert("数据返回错误！请稍后再试");
            }
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      },
      getVocations() {
        var vm = this
        $.ajax({
          type: "GET",
          dataType: "json",
          url: vm.getAllVocationsUrl,
          async: false,
          success: function(data) {
            if (data.Status == 200) {
              vm.vocations = data.msg
            } else {
              alert("数据返回错误！请稍后再试");
            }
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      },
      searchUser() {
        var vm = this
        if (vm.searchNumber == "") {
          alert("请输入您要查找的账号")
          return
        }
        $.ajax({
          type: "GET",
          dataType: "json",
          url: vm.searchUserUrl,
          async: false,
          data: {
            'number': vm.searchNumber
          },
          success: function(data) {
            if (data.Status == 200) {
              if (data.msg == null) {
                alert("请检查您输入的账号并重试")
              } else {
                vm.showSearch = true
                vm.searchItem = data.msg
              }
            } else {
              alert("数据返回错误！请稍后再试");
            }
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      },
      seeMsg() {
        if (this.showMsg) {
          this.showMsg = false
        } else {
          this.showMsg = true
          this.userMsg = this.userItem
        }
      },
      seePwd() {
        if (this.showPwd) {
          this.showPwd = false
        } else {
          this.showPwd = true
        }
      },
      changeMsg() {
        var vm = this;
        vm.userMsg.id = vm.$cookies.get('user').id
        $.ajax({
          type: "POST",
          dataType: "json",
          contentType: "application/json;charset=UTF-8",
          data: JSON.stringify(vm.userMsg),
          url: vm.changeMsgUrl,
          async: false,
          success: function(data) {
            if (data.Status == 200) {
              vm.seeMsg();
              vm.getUser();
              alert("修改成功！");
            } else {
              alert("数据返回错误！请稍后再试");
            }
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      },
      changePwd() {
        var vm = this;
        vm.userPwd.id = vm.$cookies.get('user').id
        $.ajax({
          type: "POST",
          dataType: "json",
          contentType: "application/json;charset=UTF-8",
          data: JSON.stringify(vm.userPwd),
          url: vm.changePwdUrl,
          async: false,
          success: function(data) {
            if (data.Status == 200) {
              if (data.msg == 1) {
                vm.seePwd();
                vm.getUser();
                alert("修改成功！");
              } else {
                alert("修改失败，请检查您的旧密码后重试");
              }
            } else {
              alert("数据返回错误！请稍后再试");
            }
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      },
      addOccupation() {
        var vm = this
        if (vm.userOcc.vocationId == "" || vm.userOcc.name == "") {
          alert("请填写该职业的完整信息并重试。")
          return
        }
        $.ajax({
          type: "POST",
          dataType: "json",
          contentType: "application/json;charset=UTF-8",
          data: JSON.stringify(vm.userOcc),
          url: vm.addOccupationUrl,
          async: false,
          success: function(data) {
            if (data.Status == 200) {
              alert("增加职业成功");
              vm.userOcc.vocationId = ""
              vm.userOcc.name = ""
            } else {
              alert("数据返回错误！请稍后再试");
            }
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      },
      sendCheck(type, id) {
        var vm = this;
        $.ajax({
          type: "POST",
          dataType: "json",
          contentType: "application/json;charset=UTF-8",
          data: JSON.stringify({
            'id': id,
            'isChecked': type
          }),
          url: vm.changeMsgUrl,
          async: false,
          success: function(data) {
            if (data.Status == 200) {
              switch (type) {
                case 0:
                  alert("驳回成功！")
                  vm.getCheckedUser()
                  break;
                case 1:
                  alert("认证成功！")
                  vm.getCheckedUser()
                  break;
                case 2:
                  alert("发送认证请求成功！");
                  vm.getUser();
                  break;
              }
            } else {
              alert("数据返回错误！请稍后再试");
            }
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      },
      getCheckedUser() {
        var vm = this;
        $.ajax({
          type: "GET",
          dataType: "json",
          url: vm.getCheckedUserUrl,
          async: false,
          success: function(data) {
            if (data.Status == 200) {
              vm.unCheckedUser = data.msg
            } else {
              alert("数据返回错误！请稍后再试");
            }
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      },
      showUserDetail(item) {
        var vm = this
        if (vm.showSearch) {
          vm.showSearch = false
          return
        }
        vm.searchItem = item
        vm.showSearch = true
      }
    }
  };
</script>
