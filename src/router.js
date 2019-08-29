import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home";

Vue.use(Router);

export default new Router({
  // mode: "history",
  mode: "hash",
  routes: [
    {
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
