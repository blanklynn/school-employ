<template>
  <div id="main" v-if="ifShow">
    <section class="post">
      <h3>欢迎使用浙江工商大学校园招聘论坛</h3>
      <ul class="actions fit">
        <li><a @click="changeTab(1)" v-bind:class="buttonOneClass">帖子列表</a></li>
        <li><a @click="changeTab(2)" v-bind:class="buttonTwoClass">发布帖子</a></li>
        <li><a @click="changeTab(3)" v-bind:class="buttonThrClass">我的帖子</a></li>
      </ul>
      <div class="box">
        <div class="table-wrapper">
          <table v-if="buttonOneClass == 'button special fit'">
            <thead>
              <tr>
                <th>类型</th>
                <th>发布标题</th>
                <th>发布人</th>
                <th>发布时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in posts" :id="item.id">
                <td><u v-if="item.post.type == 0">normal</u><u v-else>speech</u></td>
                <td>
                  <router-link :to="{path:'/postDetail',query: {pid:item.post.id}}">
                    {{item.post.title}}
                  </router-link>
                </td>
                <td>{{item.userName}}</td>
                <td>{{item.createAt}}</td>
              </tr>
            </tbody>
          </table>
          <table v-else-if="buttonThrClass == 'button special fit'">
            <thead>
              <tr>
                <th>发布标题</th>
                <th>发布时间</th>
                <th>评论数</th>
                <th>申请数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in myPosts" :id="item.id">
                <td>
                  <router-link :to="{path:'/postDetail',query: {pid:item.post.id}}">
                    {{item.post.title}}
                  </router-link>
                </td>
                <td>{{item.createAt}}</td>
                <td>{{item.post.commentSum}}</td>
                <td>{{item.post.applyNum}}/{{item.post.applySum}}</td>
                <td>
                  <!-- 没圈
                  <a @click="getPostList(item.post.id)" class="icon fa-eye"></a>
                  有圈 -->
                  <ul class="icons alt">
                    <li><a @click="getPostList(item.post.id)" class="icon fa-eye"></a></li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>   <!-- <li><a @click="updatePost(item.post)" class="icon small alt fa-cog"></a></li>
                  <li><a @click="deletePost(item.post)" class="icon small alt fa-close"></a></li> -->
          <hr v-if="showList" />
          <table v-if="showList">
            <thead>
              <tr>
                <th>姓名</th>
                <th>班级</th>
                <th>联系电话</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in postList" :id="item.id">
                <td>{{item.name}}</td>
                <td>{{item.major}}{{item.className}}</td>
                <td>{{item.phone}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <form class="alt" v-if="buttonTwoClass == 'button special fit' || showForm">
          <div class="row uniform">
            <div class="3u 12u$(xsmall)">
              <div class="select-wrapper">
                <select v-model="newPost.type">
                  <option value=-1>- 帖子类型 -</option>
                  <option value=0>普通帖子</option>
                  <option value=1>宣讲会帖子</option>
                </select>
              </div>
            </div>
            <div class="8u$ 12u$(xsmall)">
              <input type="text" v-model="newPost.title" placeholder="请输入您的标题" />
            </div>
            <div class="12u$(xsmall)" v-if="newPost.type == 1">
              您的宣讲会可申请的人数上限:&nbsp;<input type="number" v-model="newPost.applySum" />
            </div>
            <div class="12u$">
              <textarea type="text" v-model="newPost.content" placeholder="请输入您的帖子内容" rows="6"></textarea>
            </div>
            <div class="12u$">
              <ul class="actions">
                <li><input type="submit" value="确认发布" class="special" @click="addPost()" /></li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name: "Post",
    data() {
      return {
        ifShow: true,
        buttonOneClass: 'button special fit',
        buttonTwoClass: 'button fit',
        buttonThrClass: 'button fit',
        showForm: false,
        showList: false,
        posts: [],
        myPosts: [],
        newPost: {
          title: '',
          content: '',
          applySum: -1,
          type: -1
        },
        postList: [],
        getAllPostUrl: "http://localhost:8090/post/all",
        getMyPostUrl: "http://localhost:8090/post/my",
        getPostListUrl: "http://localhost:8090/post/apply/list",
        addPostUrl: "http://localhost:8090/post/new",
        changePostUrl: "http://localhost:8090/post"
      }
    },
    created: function() {
      if (this.$cookies.isKey('user')) {
        this.getPosts()
        this.getMyPosts()
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
            this.newPost.type = -1
            this.newPost.title = ''
            this.newPost.content = ''
            this.newPost.applySum = -1
            break;
          case 3:
            this.buttonThrClass = 'button special fit'
            this.showForm = false
        }
      },
      getPosts() {
        var vm = this
        $.ajax({
          type: "GET",
          dataType: "json",
          url: this.getAllPostUrl,
          async: false,
          success: function(data) {
            if (data.Status == 200) {
              vm.posts = data.msg
            } else {
              alert("数据返回错误！请稍后再试");
            }
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      },
      getMyPosts() {
        var vm = this
        $.ajax({
          type: "GET",
          dataType: "json",
          data: {
            'uid': vm.$cookies.get('user').id
          },
          url: this.getMyPostUrl,
          async: false,
          success: function(data) {
            if (data.Status == 200) {
              vm.myPosts = data.msg
            } else {
              alert("数据返回错误！请稍后再试");
            }
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      },
      getPostList(id) {
        var vm = this
        if (vm.showList) {
          vm.showList = false
          return
        }

        $.ajax({
          type: "GET",
          dataType: "json",
          url: vm.getPostListUrl,
          async: false,
          data: {
            'id': id
          },
          success: function(data) {
            if (data.Status == 200) {
              vm.postList = data.msg
              vm.showList = true
            } else {
              alert("数据返回错误！请稍后再试");
            }
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      },
      addPost() {
        var vm = this
        var url = ""
        if (vm.showForm) {
          url = vm.changePostUrl
        } else {
          url = vm.addPostUrl
          delete vm.newPost.id
        }
        if (vm.newPost.applySum < 1) {
          alert("请检查您的宣讲会申请人数并重试，谢谢")
          return
        }
        vm.newPost.userId = vm.$cookies.get('user').id
        $.ajax({
          type: "POST",
          dataType: "json",
          contentType: "application/json;charset=UTF-8",
          data: JSON.stringify(vm.newPost),
          url: url,
          async: false,
          success: function(data) {
            if (data.Status == 200) {
              vm.changeTab(1);
              vm.getPosts();
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
      updatePost(item) {
        var vm = this
        vm.newPost = item
        vm.showForm = true
      },
      deletePost(post) {
        var vm = this
        var text = "您确定要删除帖子-" + post.title + "-吗？"
        var isDelete = window.confirm(text);
        if (isDelete) {
          $.ajax({
            type: "DELETE",
            dataType: "json",
            data: {
              'pid': post.id
            },
            url: vm.changePostUrl,
            async: false,
            success: function(data) {
              if (data.Status == 200) {
                vm.getMyPosts();
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
      }
    }
  };
</script>
