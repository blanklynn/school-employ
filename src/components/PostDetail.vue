<template>
  <div id="main">
    <section class="post">
      <header>
        <h2>{{postItem.post.title}}</h2>
        <p>from {{postItem.userName}}</p>
      </header>
      <pre style="word-wrap: break-word; white-space: pre-wrap;">{{postItem.post.content}}</pre>
      <ul class="actions">
        <li><a @click="showComment()" class="button special">评论</a></li>
        <li v-if="postItem.post.type == 1">
          <a v-if="applyStatus" class="button special disabled">已申请</a>
          <a v-else @click="addApply()" class="button special">申请宣讲会</a>
        </li>
      </ul>
      <hr />
      <form class="alt" v-if="ifComment">
        <div class="row uniform">
          <div class="12u$">
            <textarea type="text" v-model="comment.content" placeholder="请输入您的评论内容" rows="6"></textarea>
          </div>
          <div class="12u$">
            <ul class="actions">
              <li><input type="submit" value="确认提交" class="special" @click="addComment()" /></li>
            </ul>
          </div>
        </div>
      </form>
      <footer v-else id="footer">
        <section class="split contact">
          <section v-for="item in comments" :id="item.comment.id">
            <div class="row uniform">
              <div class="8u 12u">
                <h3>第{{item.comment.commentIndex}}楼-{{item.userName}}:</h3>
                <p>{{item.comment.content}}</p>
              </div>
              <div class="4u 12u$" style="text-align:right">
                <ul class="actions">
                  <li v-if="item.isLike == 0"><a @click="like(item.comment.id)" class="button small icon fa-heart-o">赞{{item.comment.commentLikeSum}}</a></li>
                  <li v-else><a @click="unlike(item.comment.id)" class="button small icon fa-heart">赞{{item.comment.commentLikeSum}}</a></li>
                  <li v-if="item.comment.userId == userId"><a @click="deleteComment(item.comment.id)" class="button small">删除</a></li>

                </ul>
                <ul>
                  <h3>{{item.createAt}}</h3>
                </ul>
              </div>
            </div>

          </section>
        </section>
      </footer>

    </section>
  </div>

</template>

<script>
  export default {
    name: "PostDetail",
    data() {
      return {
        userId: 0,
        ifComment: false,
        applyStatus: false,
        postItem: {},
        comments: [],
        comment: {
          content: ''
        },
        getPostDetailUrl: "http://localhost:8090/post",
        getApplyUrl: "http://localhost:8090/post/apply",
        getLikeUrl: "http://localhost:8090/comment/like",
        getCommentsUrl: "http://localhost:8090/comment"
      }
    },
    created: function() {
      var vm = this
      vm.userId = vm.$cookies.get('user').id
      $.ajax({
        type: "GET",
        dataType: "json",
        url: vm.getPostDetailUrl,
        async: false,
        data: {
          'pid': vm.$route.query.pid
        },
        success: function(data) {
          if (data.Status == 200) {
            vm.postItem = data.msg
            if (data.msg.post.type == 1) {
              vm.getApplyStatus()
            }
          } else {
            alert("数据返回错误！请稍后再试");
          }
        },
        error: function() {
          alert("服务器发生错误！请稍后再试");
        }
      });
      vm.getComments();
    },
    methods: {
      getComments() {
        var vm = this
        $.ajax({
          type: "GET",
          dataType: "json",
          url: vm.getCommentsUrl,
          async: false,
          data: {
            'pid': vm.$route.query.pid,
            'uid': vm.userId
          },
          success: function(data) {
            if (data.Status == 200) {
              vm.comments = data.msg
            } else {
              alert("数据返回错误！请稍后再试");
            }
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      },
      showComment() {
        if (this.ifComment) {
          this.ifComment = false;
        } else {
          this.ifComment = true;
        }
      },
      addComment() {
        var vm = this
        if (vm.comment.content == "") {
          alert("请填写您的评论内容")
          return
        }
        vm.comment.userId = vm.userId
        vm.comment.postId = vm.$route.query.pid

        $.ajax({
          type: "POST",
          dataType: "json",
          url: vm.getCommentsUrl,
          async: false,
          contentType: "application/json;charset=UTF-8",
          data: JSON.stringify(vm.comment),
          success: function(data) {
            if (data.Status == 200) {
              vm.comment.content = ''
              vm.ifComment = false
              vm.getComments()
              alert("评论成功！");
            } else {
              alert("数据返回错误！请稍后再试");
            }
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      },
      deleteComment(cid) {
        var vm = this
        var text = "您确定要删除该评论吗？"
        var isDelete = window.confirm(text);
        if (isDelete) {
          $.ajax({
            type: "DELETE",
            dataType: "json",
            data: {
              'cid': cid
            },
            url: vm.getCommentsUrl,
            async: false,
            success: function(data) {
              if (data.Status == 200) {
                vm.getComments()
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
      like(cid) {
        var vm = this
        $.ajax({
          type: "POST",
          dataType: "json",
          url: vm.getLikeUrl,
          async: false,
          contentType: "application/json;charset=UTF-8",
          data: JSON.stringify({
            'userId': vm.userId,
            'commentId': cid
          }),
          success: function(data) {
            if (data.Status == 200) {
              vm.getComments()
            } else {
              alert("数据返回错误！请稍后再试");
            }
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      },
      unlike(cid) {
        var vm = this
        $.ajax({
          type: "DELETE",
          dataType: "json",
          data: {
            'uid': vm.userId,
            'cid': cid
          },
          url: vm.getLikeUrl,
          async: false,
          success: function(data) {
            if (data.Status == 200) {
              vm.getComments()
            } else {
              alert("数据返回错误！请稍后再试");
            }
          },
          error: function() {
            alert("服务器发生错误！请稍后再试");
          }
        });
      },
      getApplyStatus() {
        var vm = this
        $.ajax({
          type: "GET",
          dataType: "json",
          url: vm.getApplyUrl,
          async: false,
          data: {
            'pid': vm.$route.query.pid,
            'uid': vm.userId
          },
          success: function(data) {
            if (data.Status == 200) {
              if (data.msg > 0) {
                vm.applyStatus = true
              } else {
                vm.applyStatus = false
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
      addApply() {
        var vm = this
        var text = "您确定要参加该宣讲会吗？一经申请不得取消哦～"
        var isApply = window.confirm(text);
        if (isApply) {
          $.ajax({
            type: "POST",
            dataType: "json",
            url: vm.getApplyUrl,
            async: false,
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
              'userId': vm.userId,
              'postId': vm.postItem.post.id
            }),
            success: function(data) {
              if (data.Status == 200) {
                alert("申请成功！");
                vm.getApplyStatus()
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
  }
</script>
