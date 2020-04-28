<template>
  <div id="main">
    <section class="post">
      <header>
        <h2>{{employItem.employ.title}}</h2>
        <p v-if="employItem.type == 1">推荐人:{{employItem.userName}}同学，发布于{{employItem.createAt}}</p>
        <p v-else-if="employItem.type == 2">推荐人:{{employItem.userName}}老师，发布于{{employItem.createAt}}</p>
        <p v-else>推荐人:{{employItem.userName}}企业官方，发布于{{employItem.createAt}}</p>
      </header>
      <p><strong>关键词:{{employItem.employ.keyWords}}</strong></p>
      <pre style="word-wrap: break-word; white-space: pre-wrap;">{{employItem.employ.content}}</pre>
      <hr />
      <h2>实名推荐</h2>
      <div v-for="r in recommends">
        <blockquote>{{r}}</blockquote>
      </div>
      <ul class="actions">
        <li><a @click="showRecommend()" class="button special">我要实名推荐</a></li>
        <li><a @click="showAsk()" class="button special">我要咨询岗位</a></li>
      </ul>
      <hr />
      <form class="alt" v-if="ifRecommond">
        <div class="row uniform">
          <div class="12u$">
            <textarea type="text" v-model="recommend.reason" placeholder="请输入您的推荐理由,您输入的信息将成为同学们的参考信息" rows="6"></textarea>
          </div>
          <div class="12u$">
            <ul class="actions">
              <li><input type="submit" value="确认提交" class="special" @click="addRecommend()" /></li>
            </ul>
          </div>
        </div>
      </form>
      <form class="alt" v-if="ifAsk">
        <div class="row uniform">
          <div class="3u 12u$(xsmall)">
            <div class="select-wrapper">
              <select v-model="numberType">
                <option value="">- 联系方式类型 -</option>
                <option value="手机号">手机号</option>
                <option value="邮箱">邮箱</option>
                <option value="QQ">QQ</option>
                <option value="微信">微信</option>
              </select>
            </div>
          </div>
          <div class="8u$ 12u$(xsmall)">
            <input type="text" v-model="number" placeholder="请输入您相应的联系方式" />
          </div>
          <div class="12u$">
            <textarea type="text" v-model="msg.content" placeholder="请输入您想咨询的问题,如果发布人收到将会及时联系你" rows="6"></textarea>
          </div>
          <div class="12u$">
            <ul class="actions">
              <li><input type="submit" value="确认提交" class="special" @click="addAsk()" /></li>
            </ul>
          </div>
        </div>
      </form>
    </section>
  </div>
</template>

<script>
  export default {
    name: "EmployDetail",
    data() {
      return {
        ifAsk: false,
        ifRecommond: false,
        employItem: {},
        recommends: [],
        recommend: {
          reason: ''
        },
        numberType: '',
        number: '',
        msg: {
          numbers: '',
          content: '',
        },
        getEmployDetailUrl: "http://localhost:8090/employ",
        getRecommendsUrl: "http://localhost:8090/employ/recommend",
        getAskUrl: "http://localhost:8090/employ/ask",
        addClickUrl: "http://localhost:8090/employ/click"
      }
    },
    mounted: function() {
      var vm = this
      $.ajax({
        type: "GET",
        dataType: "json",
        url: this.getEmployDetailUrl,
        async: false,
        data: {
          'eid': this.$route.query.id
        },
        success: function(data) {
          if (data.Status == 200) {
            vm.employItem = data.msg
          } else {
            alert("数据返回错误！请稍后再试");
          }
        },
        error: function() {
          alert("服务器发生错误！请稍后再试");
        }
      });

      $.ajax({
        type: "GET",
        dataType: "json",
        url: this.getRecommendsUrl,
        async: false,
        data: {
          'eid': this.$route.query.id
        },
        success: function(data) {
          if (data.Status == 200) {
            vm.recommends = data.msg.map((r) => {
              var msg = ""
              if (r.type == 1) {
                msg = "同学:  "
              } else {
                msg = "老师:  "
              }
              return r.userName + msg + r.recommend.reason
            })
          } else {
            alert("数据返回错误！请稍后再试");
          }
        },
        error: function() {
          alert("服务器发生错误！请稍后再试");
        }
      });

      this.addClick()
    },
    methods: {
      addClick() {
        var vm = this
        var newClick = {
          'userId': vm.$cookies.get('user').id,
          'employId': vm.$route.query.id
        }
        $.ajax({
          type: "POST",
          dataType: "json",
          contentType: "application/json;charset=UTF-8",
          data: JSON.stringify(newClick),
          url: vm.addClickUrl,
          async: false,
          success: function(data) {
            if (data.Status != 200) {
              alert("点击率发布错误");
            }
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      },
      showRecommend() {
        if (this.ifRecommond) {
          this.ifRecommond = false;
        } else {
          this.ifRecommond = true;
        }
      },
      addRecommend() {
        var vm = this
        if (vm.recommend.reason == "") {
          alert("请填写您的推荐理由")
          return
        }
        vm.recommend.userId = vm.$cookies.get('user').id
        vm.recommend.employId = vm.$route.query.id

        $.ajax({
          type: "POST",
          dataType: "json",
          url: this.getRecommendsUrl,
          async: false,
          contentType: "application/json;charset=UTF-8",
          data: JSON.stringify(vm.recommend),
          success: function(data) {
            if (data.Status == 200) {
              vm.recommend.reason = ''
              vm.ifRecommond = false
              alert("投递成功！");
            } else {
              alert("数据返回错误！请稍后再试");
            }
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      },
      showAsk() {
        if (this.ifAsk) {
          this.ifAsk = false;
        } else {
          this.ifAsk = true;
        }
      },
      addAsk() {
        var vm = this
        if (vm.msg.content == "") {
          alert("请填写您想咨询的问题")
          return
        }
        vm.msg.numbers = vm.numberType + ':' + vm.number
        vm.msg.userId = vm.$cookies.get('user').id
        vm.msg.employId = this.$route.query.id
        $.ajax({
          type: "POST",
          dataType: "json",
          url: this.getAskUrl,
          async: false,
          contentType: "application/json;charset=UTF-8",
          data: JSON.stringify(vm.msg),
          success: function(data) {
            if (data.Status == 200) {
              vm.msg.content = ''
              vm.ifAsk = false
              alert("咨询成功！");
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
  }
</script>
