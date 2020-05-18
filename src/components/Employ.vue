<template>
  <div id="main" v-if="ifShow">
    <section class="post">
      <h3>欢迎使用浙江工商大学校园招聘发布</h3>
      <ul class="actions fit">
        <li><a @click="changeTab(1)" v-bind:class="buttonOneClass">岗位列表</a></li>
        <li><a @click="changeTab(2)" v-bind:class="buttonTwoClass">发布岗位</a></li>
        <li><a @click="changeTab(3)" v-bind:class="buttonThrClass">我的岗位</a></li>
      </ul>
      <div class="box">
        <form class="alt" v-if="buttonOneClass == 'button special fit'">
          <div class="row uniform">
            <div class="8u 12u$(xsmall)">
              <input type="text" placeholder="请输入您要搜索的内容" v-model="searchContent" />
            </div>
            <div class="4u 12u$(xsmall)">
              <ul class="actions small">
                <li><input type="submit" v-on:click="searchEmploy()" value="搜索" /></li>
              </ul>
            </div>
          </div>
        </form>
        <div class="table-wrapper">
          <table v-if="buttonOneClass == 'button special fit'">
            <thead>
              <tr>
                <th>发布标题</th>
                <th>发布人</th>
                <th>发布岗位</th>
                <th>发布时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in employs" :id="item.id">
                <td>
                  <router-link :to="{path:'/employDetail',query: {id:item.employ.id}}">
                    {{item.employ.title}}
                  </router-link>
                </td>
                <td>{{item.userName}}</td>
                <td>{{item.occupationName}}</td>
                <td>{{item.createAt}}</td>
                <td v-if="uid == 1">
                  <ul class="icons alt">
                    <li><a class="icon alt fa-close" @click="deleteEmploy(item.employ)"></a></li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
          <table v-if="buttonThrClass == 'button special fit'">
            <thead>
              <tr>
                <th>发布标题</th>
                <th>发布岗位</th>
                <th>发布时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in myEmploys" :id="item.id">
                <td>
                  <router-link :to="{path:'/employDetail',query: {id:item.employ.id}}">
                    {{item.employ.title}}
                  </router-link>
                </td>
                <td>{{item.occupationName}}</td>
                <td>{{item.createAt}}</td>
                <td>
                  <ul class="icons alt">
                    <li><a class="icon alt fa-eye" @click="seeAsk(item.employ.id)"></a></li>
                    <li><a class="icon alt fa-close" @click="deleteEmploy(item.employ)"></a></li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <form class="alt" v-if="buttonTwoClass == 'button special fit'">
          <div class="row uniform">
            <div class="3u 12u$(xsmall)">
              <div class="select-wrapper">
                <select v-model="vid" @change="getOccupations()">
                  <option value="">-请选择行业-</option>
                  <option v-for="v in vocations" :value="v.id">{{v.name}}</option>
                </select>
              </div>
            </div>
            <div class="3u 12u$(xsmall)">
              <div class="select-wrapper">
                <select v-model="newEmploy.occupationId">
                  <option v-for="o in occupations" :value="o.id">{{o.name}}</option>
                </select>
              </div>
            </div>
            <div class="6u$ 12u$(xsmall)">
              <input type="text" v-model="newEmploy.title" placeholder="请输入您的标题" />
            </div>
            <div class="6u$ 12u$(xsmall)">
              <input type="text" v-model="newEmploy.keyWords" placeholder="请输入该岗位的关键词,用英文;来分隔多个" />
            </div>
            <div class="12u$">
              <textarea type="text" v-model="newEmploy.content" placeholder="请输入您的岗位招聘内容" rows="6"></textarea>
            </div>
            <div class="12u$">
              <ul class="actions">
                <a v-if="isChecked == 1" @click="addEmploy()" class="button special">确认发布</a>
                <a v-else class="button special disabled">您未认证，不能发布岗位</a>
              </ul>
            </div>
          </div>
        </form>
      </div>
      <div v-if="showAsks" v-for="a in asks">
        <blockquote>{{a.userName}}({{a.employAsk.numbers}}):{{a.employAsk.content}}</blockquote>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name: "Employ",
    data() {
      return {
        uid: '',
        ifShow: true,
        buttonOneClass: 'button special fit',
        buttonTwoClass: 'button fit',
        buttonThrClass: 'button fit',

        newEmploy: {
          occupationId: '',
          title: '',
          content: '',
          keyWords: ''
        },
        addEmployUrl: "http://localhost:8090/employ",

        employs: [],
        getAllEmployUrl: "http://localhost:8090/employ/all",

        searchContent: '',
        searchEmployUrl: "http://localhost:8090/employ/search",

        myEmploys: [],
        getMyEmployUrl: "http://localhost:8090/employ/my",

        showForm: false,
        vocations: [],
        isChecked: '',
        vid: '',
        occupations: [],
        getOccupationsUrl: "http://localhost:8090/occupation/all",
        getAllVocationsUrl: "http://localhost:8090/vocation",
        getUserUrl: "http://localhost:8090/user",

        showAsks: false,
        asks: [],
        getAsksUrl: "http://localhost:8090/employ/ask"
      }
    },
    created: function() {
      if (this.$cookies.isKey('user')) {
        this.uid = this.$cookies.get('user').id
        this.getEmploys()
        this.getMyEmploys()
        this.getVocations()
        this.getChecked()
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
            this.showForm = false
            break;
          case 2:
            this.buttonTwoClass = 'button special fit'
            this.newEmploy.occupationId = -1
            this.newEmploy.title = ''
            this.newEmploy.content = ''
            this.newEmploy.keyWords = ''
            break;
          case 3:
            this.buttonThrClass = 'button special fit'
            this.showForm = false
        }
      },
      getEmploys() {
        var vm = this
        $.ajax({
          type: "GET",
          dataType: "json",
          url: this.getAllEmployUrl,
          async: false,
          data: {
            'id': vm.$cookies.get('user').id
          },
          success: function(data) {
            if (data.Status == 200) {
              vm.employs = data.msg
            } else {
              alert("数据返回错误！请稍后再试");
            }
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      },
      getMyEmploys() {
        var vm = this
        $.ajax({
          type: "GET",
          dataType: "json",
          data: {
            'id': vm.$cookies.get('user').id
          },
          url: this.getMyEmployUrl,
          async: false,
          success: function(data) {
            if (data.Status == 200) {
              vm.myEmploys = data.msg
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
      getChecked() {
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
              vm.isChecked = data.msg.isChecked
            } else {
              alert("数据返回错误！请稍后再试");
            }
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      },
      seeAsk(id) {
        var vm = this
        if (vm.showAsks) {
          vm.showAsks = false;
        } else {
          $.ajax({
            type: "GET",
            dataType: "json",
            data: {
              'eid': id
            },
            url: this.getAsksUrl,
            async: false,
            success: function(data) {
              if (data.Status == 200) {
                vm.asks = data.msg
                vm.showAsks = true
              } else {
                alert("数据返回错误！请稍后再试");
              }
            },
            error: function() {
              alert("服务器发生错误！请稍后再试");
            }
          });
        }
      },
      getOccupations() {
        var vm = this
        if (vm.vid == "") {
          return
        }
        $.ajax({
          type: "GET",
          dataType: "json",
          url: vm.getOccupationsUrl,
          async: false,
          data: {
            'vid': vm.vid
          },
          success: function(data) {
            if (data.Status == 200) {
              vm.occupations = data.msg
            } else {
              alert("数据返回错误！请稍后再试");
            }
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      },
      addEmploy() {
        var vm = this
        vm.newEmploy.userId = vm.$cookies.get('user').id
        $.ajax({
          type: "POST",
          dataType: "json",
          contentType: "application/json;charset=UTF-8",
          data: JSON.stringify(vm.newEmploy),
          url: vm.addEmployUrl,
          async: false,
          success: function(data) {
            if (data.Status == 200) {
              vm.changeTab(1);
              vm.getEmploys();
              alert("发布成功！");
            } else {
              alert("数据返回错误！请稍后再试");
            }
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      },
      deleteEmploy(employ) {
        var vm = this
        var text = "您确定要删除岗位-" + employ.title + "-吗？"
        var isDelete = window.confirm(text);
        if (isDelete) {
          $.ajax({
            type: "DELETE",
            dataType: "json",
            data: {
              'eid': employ.id
            },
            url: vm.addEmployUrl,
            async: false,
            success: function(data) {
              if (data.Status == 200) {
                vm.getEmploys();
                vm.getMyEmploys();
                alert("删除成功！");
              } else {
                alert("数据返回错误！请稍后再试");
              }
            },
            error: function() {
              alert("服务器发生错误！请稍后再试");
            }
          });
        }
      },
      searchEmploy() {
        var vm = this
        if (vm.searchContent == "") {
          alert("请输入您的搜索内容后重试，谢谢")
          return
        }
        $.ajax({
          type: "GET",
          dataType: "json",
          url: vm.searchEmployUrl,
          async: false,
          data: {
            'content': vm.searchContent
          },
          success: function(data) {
            if (data.Status == 200) {
              vm.employs = data.msg
            } else {
              alert("数据返回错误！请稍后再试");
            }
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      }
    }
  };
</script>
