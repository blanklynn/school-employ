<template>
  <div id="app">
    	<div id="wrapper" class="fade-in">
    			<div id="intro">
    				<h1>ZJGSU<br />
    				Employment</h1>
    				<p>A free employing website form linzhuojing for ZJGSU.<br /></p>
    				<ul class="actions">
    					<li><a href="#footer" class="button icon solo fa-arrow-down scrolly">Continue</a></li>
    				</ul>
    			</div>

    		<!-- Nav -->
    			<nav id="nav">
    				<ul class="links">
    					<li><router-link to="/" exact>首页</router-link></li>
              <li><router-link to="/employ">招聘</router-link></li>
    					<li><router-link to="/post">论坛</router-link></li>
    					<li><router-link to="/user">设置</router-link></li>
    				</ul>
    			</nav>

          <router-view/>

    		<!-- Copyright -->
    			<div id="copyright">
    				<ul><li>&copy; linzhuojing</li><li>1612190219</li></ul>
    			</div>

    	</div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<!-- <style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style> -->
