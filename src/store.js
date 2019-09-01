import Vue from "vue";
import Vuex from "vuex";
import * as api from "./components/api";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    player: {
      versions: "v1.1.5.20190902",
      __test_message: "",
      // 播放状态
      play: false,
      // ------------------------
      // URL
      music_url: "",
      // 封面地址
      cover_imgSrc: "",
      // 歌词滚动的索引
      lyricIndex: -1,
      // 歌词对象
      lyricList: [
        { content: "Hello World ~" },
        { content: "欢迎你来体验 Music-Player" },
        { content: "author : Ordinary" }
      ],
      // ------------------------
      // 当前播放对象
      playSong: {
        // 当前播放歌曲ID
        id: "",
        // 当前播放列表类型
        listType: "collect",
        // 当前当前播放的歌曲、在该列表类型中的索位置、
        index: -1
      },
      // 当前查看的列表类型
      currentSonglistType: "collect",
      // 所有的歌曲列表
      songlistAll: {
        recently: {
          title: "最近播放",
          imgUrl:
            "data:image/png;base64,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",
          list: []
        },
        collect: {
          title: "我的收藏",
          imgUrl:
            "http://p4.music.126.net/tGHU62DTszbFQ37W9qPHcg==/2002210674180197.jpg",
          list: []
        },
        seekPlay: {
          title: "最近搜索播放",
          imgUrl:
            "http://p4.music.126.net/tGHU62DTszbFQ37W9qPHcg==/2002210674180197.jpg",
          list: []
        }
      }
    }
  },
  mutations: {
    // 只能执行同步的
    // 改变vuex中的状态
    // 用法 this.$store.commit('xxx')
    //      mapMutations(['xxx'])
    //      mapMutations({newXXX:'xxx'})
    // init -- 初始化
    init(state) {
      const initData = {
        play: false,
        music_url: "",
        cover_imgSrc: "",
        lyricIndex: -1,
        lyricList: [
          { content: "Hello World ~" },
          { content: "欢迎你来体验 Music-Player" },
          { content: "author : Ordinary" }
        ],
        playSong: {
          id: "",
          listType: "collect",
          index: -1
        }
      };
      for (let key in initData) {
        Vue.set(state.player, key, initData[key]);
      }
    },
    // 控制播放器
    control(state, type) {
      if (!type) return;
      if (type === "play") {
        let index = state.player.playSong.index;
        if (index === -1) {
          // 判断为初始化后没有当前歌曲，直接下一个、
          this._mutations.control[0]("next"); // 调用自身
        } else {
          musicPlayer.play();
        }
      } else if (type === "pause") {
        musicPlayer.pause();
      } else {
        let index = state.player.playSong.index,
          listType = state.player.playSong.listType,
          len = state.player.songlistAll[listType].list.length;
        if (len === 0) {
          // 列表没有歌曲 (初始化)
          this._mutations.init[0](); // 就是 init(state)
          return;
        }
        if (type === "prev") {
          index--;
        } else if (type === "next") {
          index++;
        }
        if (index < 0) index = len - 1;

        if (index > len - 1) index = 0;

        this._mutations.getDataOnly[0]({
          listType,
          index,
          type: "ListBoxItem"
        });
      }
    },
    // 清空列表
    empty(state, type) {
      if (!type) return;
      Vue.set(state.player.songlistAll[type], "list", []);
      api.addCache(type, state.player.songlistAll[type]);
    },
    // 获取歌曲列表 online == true 必须通过网络获取  id -- 可以为数据批量获取、prefix -- 前缀
    getData(state, { online, id = 3778678, prefix = "Crunchies_" }) {
      let idArr = id.constructor === Array ? id : [id];
      idArr.forEach(idItem => {
        let key = prefix + idItem,
          playlist = api.getCache(key);
        if (playlist && !online) {
          this._mutations.addSonglist[0]({
            key,
            playlist,
            isUpCache: false
          });
        } else {
          api.get({ types: "playlist", id: idItem }).then(({ data }) => {
            data = data.playlist || {};
            const playlist = api.filterObj(
              data,
              ["name", "coverImgUrl", "tracks"],
              ["title", "imgUrl", "list"]
            );
            playlist["list"] = api.filterObj(playlist["list"], [
              "al",
              "name",
              "id",
              "ar",
              "publishTime"
            ]);
            this._mutations.addSonglist[0]({ key, playlist, isUpCache: true });
          });
        }
      });
    },
    // 获取单条歌曲详细 url、lyric、picUrl
    getDataOnly(state, { listType, index }) {
      const item = state.player.songlistAll[listType].list[index];
      api.ajaxSong.detailed(item, data => {
        // ----------------------------------------------------
        state.player.music_url = data.url;
        state.player.cover_imgSrc = data.picUrl;
        state.player.lyricList = data.lyricList;
        state.player.lyricIndex = -1;
        // ----------------------
        state.player.playSong.listType = listType;
        state.player.playSong.index = index;
        state.player.playSong.id = data.id;
        // ----------------------
        if (!data.url) {
          // 有错误，该歌曲无法播放
          state.player.__test_message = "有错误，该歌曲无法播放";
          // 移除无法播放的歌曲、
          this._mutations.dleSonglistItem[0]({
            listType,
            id: data.id
          });
          this._mutations.dleSonglistItem[0]({
            listType,
            id: data.id
          });
          this._mutations.control[0]("next");
          return;
        }
        // upSonglistCover  更新歌曲列表封面
        Vue.set(state.player.songlistAll["recently"], "imgUrl", data.picUrl);
        // listType !== "recently"
        // 如果当前播放的歌曲属于'最近播放列表'的那么它肯定已经存在了、所以不需要执行
        if (listType !== "recently") {
          this._mutations.addSonglistItem[0]({
            listType: "recently",
            item,
            up: true
          });
        }
        // ----------------------------------------------------
      });
    },
    // ------------------------------------------------------------------------------------
    // 添加播放列表、(vuex、缓存)   isUpCache == true 表示需要更新缓存
    addSonglist(state, { key, playlist, isUpCache }) {
      // Vue.set -- 更新视图
      Vue.set(state.player.songlistAll, key, playlist);
      if (isUpCache) api.addCache(key, playlist);
    },
    // 删除播放列表、(vuex、缓存)   isUpCache == true 表示需要更新缓存
    dleSonglist(state, { key, isUpCache }) {
      // 容错处理
      // 防止报错，将当前查看的列表切换到'最近播放'的列表。
      if (state.player.currentSonglistType === key)
        state.player.currentSonglistType = "recently";
      if (state.player.playSong.listType === key) {
        // 防止报错，将当前播放的歌曲切换到'最近播放'的列表。
        state.player.playSong.listType = "recently";
        state.player.playSong.index = 0;
      }
      Vue.delete(state.player.songlistAll, key);
      if (isUpCache) api.dleCache(key);
    },
    // 从缓存中读取所有的列表，并添加到歌曲列表中、
    addSonglistAll(state) {
      const list = api.getCacheIndex();
      list.forEach(key => {
        const playlist = api.getCache(key);
        if (playlist)
          this._mutations.addSonglist[0]({
            key,
            playlist,
            isUpCache: false
          });
      });
    },
    // ------------------------------------------------------------------------------------
    // getSonglistItem(state, { listType, index }) {
    //   // 返回不了
    //   const item = state.player.songlistAll[listType].list[index];
    // },
    addSonglistItem(state, { listType, item, up = false }) {
      const songlist = state.player.songlistAll[listType],
        is = songlist.list.some((ele, index) => {
          let is = ele.id === item.id;
          if (!is) return false; // 没有相同的、
          // 有相同的、is == true
          if (!up) return true; // up == false 不需要覆盖
          songlist.list.splice(index, 1);
          return false;
        });
      if (is) return;
      songlist.list.unshift(item);
      songlist.list = songlist.list.splice(0, 1000);
      api.addCache(listType, songlist);
    },
    dleSonglistItem(state, { listType, id }) {
      const songlistAll = state.player.songlistAll[listType];
      songlistAll.list.forEach((ele, index) => {
        if (ele.id === id) {
          songlistAll.list.splice(index, 1);
        }
      });
      api.addCache(listType, songlistAll);
    },
    // ------------------------------------------------------------------------------------
    seekItem(state, { item, type, cancel }) {
      let upItem = {
        id: item.id,
        name: item.name,
        ar: [{ name: item.artist[0] }],
        al: { name: item.album, picUrl: "" }
      };
      api
        .get({
          types: "pic",
          id: item.pic_id,
          source: "netease"
        })
        .then(({ data }) => {
          let reg = /^([\S]+)\?param=[\d]+y[\d]+$/;
          upItem.al["picUrl"] = data.url.match(reg)[1];
          // 异步
          if (type === "collect") {
            const listType = "collect";
            if (cancel) {
              // 收藏列表已有--删除它
              this._mutations.dleSonglistItem[0]({
                listType,
                id: upItem.id
              });
            } else {
              // 收藏列表没有--添加它
              this._mutations.addSonglistItem[0]({
                listType,
                item: upItem,
                up: true
              });
            }
          } else if (type === "play") {
            const listType = "seekPlay";
            // upSonglistCover  更新歌曲列表封面
            Vue.set(state.player.songlistAll[listType], "imgUrl", data.url);
            // 将歌曲添加到搜索播放列表并置顶(覆盖)
            this._mutations.addSonglistItem[0]({
              listType,
              item: upItem,
              up: true
            });
            // 现在立刻播放它
            this._mutations.getDataOnly[0]({
              listType,
              index: 0,
              type: "ListBoxItem"
            });
          }
        });
    }
  },
  actions: {}
});
