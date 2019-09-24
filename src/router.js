import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home";

// Vue.use(Router); -- 使路由插件生效
// $router -- 路由方法    $route -- 路由属性
Vue.use(Router);

export default new Router({
	// mode -- 切换路由的模式(hash、history)
	// mode: "history",
	mode: "hash",
	routes: [{
			path: "/",
			name: "home",
			redirect: "/player",
			component: Home
		},
		{
			path: "/player",
			name: "player",
			component: () => import("./views/Player")
		},
		{
			path: "/nowPlaying",
			name: "nowPlaying",
			component: () => import("./views/NowPlaying")
		},
		{
			path: "/playlist",
			name: "playlist",
			component: () => import("./views/Playlist")
		}
	]
});
