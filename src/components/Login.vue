<template>
  <footer v-if="showLogin" id="footer">
    <section>
      <form>
        <div class="field">
          <label for="number">账号</label>
          <input type="text" v-model="user.number" />
        </div>
        <div class="field">
          <label for="password">密码</label>
          <input type="password" v-model="user.password" />
        </div>
        <ul class="actions">
          <li><input type="submit" v-on:click="getLogin()" value="登录" /></li>
          <li><input type="submit" v-on:click="showRegister()" value="注册" /></li>
        </ul>
      </form>
    </section>
    <section class="split contact">
      <section class="alt">
        <h3>Author</h3>
        <p>Lin zhuojing</p>
      </section>
      <section>
        <h3>Class</h3>
        <p>计科1602</p>
      </section>
      <section>
        <h3>Teacher</h3>
        <p>Wang ye</p>
      </section>
      <section>
        <h3>Email</h3>
        <p>
          <a href="#">404013841@qq.com</a>
        </p>
      </section>
    </section>
  </footer>

  <footer v-else id="footer">
    <section>
      <form>
        <div class="field">
          <label for="number">账号</label>
          <input type="text" placeholder="请输入您的账号" v-model="newuser.number" />
        </div>
        <div class="field">
          <label for="password">密码</label>
          <input type="password" placeholder="请输入您的密码" v-model="newuser.password" />
        </div>
        <div class="field">
          <label for="name">姓名</label>
          <input type="text" placeholder="请输入您的真实姓名" v-model="newuser.name" />
        </div>
        <div class="field">
          <label for="nike">昵称</label>
          <input type="text" placeholder="请输入您的昵称" v-model="newuser.nike" />
        </div>
        <div class="field">
          <label for="sex">性别</label>
          <select v-model="newuser.sex">
            <option value="">- 请选择您的性别 -</option>
            <option value="0">男</option>
            <option value="1">女</option>
          </select>
        </div>
        <div class="field">
          <label for="major">专业全称</label>
          <input type="text" placeholder="请选择您的专业" v-model="newuser.major" />
        </div>
        <div class="field">
          <label for="class_name">班级</label>
          <input type="text" placeholder="请输入您的班级号,ex.1602" v-model="newuser.className" />
        </div>
        <div class="field">
          <label for="phone">电话</label>
          <input type="text" placeholder="请输入您的电话" v-model="newuser.phone" />
        </div>
        <div class="field">
          <label for="mail">邮箱</label>
          <input type="text" placeholder="请输入您的邮箱" v-model="newuser.mail" />
        </div>
        <div class="field">
          <label for="type">身份</label>
          <select v-model="newuser.type">
            <option value="">- 请选择您的账号身份 -</option>
            <option value="1">学生</option>
            <option value="2">老师</option>
            <option value="3">企业</option>
          </select>
        </div>
        <ul class="actions">
          <li><input type="submit" v-on:click="getRegister()" value="确认注册" /></li>
        </ul>
      </form>
    </section>

    <section class="split contact">
      <section>
        <h2>Notice:</h2>
        <p><br /><br /><br />本网站用于浙江工商大学内部招聘，集成发布招聘，发布岗位等功能，欢迎大家踊跃发言。</p>
      </section>
    </section>
  </footer>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        showLogin: true,
        user: {
          number: '',
          password: ''
        },
        newuser: {
          number: '',
          password: '',
          name: '',
          nike: '',
          sex: '',
          major: '',
          className: '',
          phone: '',
          mail: '',
          type: ''
        },
        loginUrl: "http://localhost:8090/login",
        registerUrl: "http://localhost:8090/register",
      }
    },
    created: function() {
      if (this.$cookies.isKey('user')) {
        this.$router.push({
          path: '/index'
        })
      }
    },
    methods: {
      getLogin() {
        var vm = this
        $.ajax({
          type: "POST",
          dataType: "json",
          url: this.loginUrl,
          async: false,
          contentType: "application/json;charset=UTF-8",
          data: JSON.stringify(vm.user),
          success: function(data) {
            if (data.Status == 200 && data.msg != "-1") {
              vm.$cookies.set('user', data.msg);
              vm.$router.push({
                path: '/index'
              })
            } else {
              alert("用户名或密码错误，请重试")
            }
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      },
      showRegister() {
        this.showLogin = false;
      },
      getRegister() {
        var vm = this
        $.ajax({
          type: "POST",
          dataType: "json",
          url: this.registerUrl,
          async: false,
          contentType: "application/json;charset=UTF-8",
          data: JSON.stringify(vm.newuser),
          success: function(data) {
            alert("注册成功！");
            vm.showLogin = true;
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      },
    }
  };
</script>
