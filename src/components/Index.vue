<template>
  <div id="main">
    <div class="box">
      <p>登录成功！感谢您的使用。</p>
      <ul class="actions">
        <li><input type="submit" @click="logout()" value="退出登录" /></li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Index",
    data() {
      return {}
    },
    methods: {
      logout() {
        var text = "您确定要退出登录吗？"
        var out = window.confirm(text);
        if (out) {
          this.$cookies.remove('user');
          this.$router.push({
            path: '/'
          })
        }
      }
    }
  };
</script>
