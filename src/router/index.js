import Vue from 'vue'
import Router from 'vue-router'
import VueCookies from 'vue-cookies'
import Login from '../components/Login'
import Index from '../components/Index'
import User from '../components/User'
import Employ from '../components/Employ'
import EmployDetail from '../components/EmployDetail'
import Post from '../components/Post'
import PostDetail from '../components/PostDetail'

Vue.use(Router)
Vue.use(VueCookies)
Vue.$cookies.config('1d')

// set global cookie
Vue.$cookies.set('theme','default');
Vue.$cookies.set('hover-time','1s');

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/index',
      name: 'Index',
      component: Index
    },
    {
      path: '/user',
      name: 'User',
      component: User
    },
    {
      path: '/employ',
      name: 'Employ',
      component: Employ
    },
    {
      path: '/employDetail',
      name: 'EmployDetail',
      component: EmployDetail
    },
    {
      path: '/post',
      name: 'Post',
      component: Post
    },
    {
      path: '/postDetail',
      name: 'PostDetail',
      component: PostDetail
    }
  ]
})
