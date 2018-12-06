import Vue from 'vue'
import App from './App.vue'

Vue.config.devtools = true

// 註冊components
import Note from './components/Note.vue'
import Edit from './components/Edit.vue'
import Sidebar from './components/Sidebar.vue'
import Topbar from './components/Topbar.vue'
import Welcome from './components/Welcome.vue'
import Login from './components/Login.vue'
Vue.component('Note', Note)
Vue.component('Edit', Edit)
Vue.component('Sidebar', Sidebar)
Vue.component('Topbar', Topbar)
Vue.component('Welcome', Welcome)
Vue.component('Login', Login)

// 引用vuex
import store from './helpers/vuex.js'

// 引用vue-meta
import vuemeta from 'vue-meta'
Vue.use(vuemeta)

let vm = new Vue({
	el: '#app',
	render: h => h(App),
	store
})