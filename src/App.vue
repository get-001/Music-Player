<template>
  <div
    id="App"
    class="container"
    :test="message(player.__test_message)"
    v-swipeleft="swipeleft"
    v-swiperight="swiperight"
  >
    <Background :image="player.cover_imgSrc" />
    <nav class="nav-page">
      <router-link class="nav-btn" tag="span" :to="{name:'player'}">播放器</router-link>
      <router-link class="nav-btn" tag="span" :to="{name:'nowPlaying'}">正在播放</router-link>
      <router-link class="nav-btn" tag="span" :to="{name:'playlist'}">播放列表</router-link>
      <span class="nav-btn" @click="isShow_search=true">歌曲搜索</span>
    </nav>

    <router-view class="wraper" />

    <PlayControl v-model="musicProgress" />
    <SongSearch v-model="isShow_search" />
    <audio id="musicPlayer" :src="player.music_url" autoplay></audio>
    <Alert
      v-model="showHelloWorld"
      @AlertResult="showHelloWorld=false"
      :title="'Music-Player '+player.versions"
    >
      <div id="HelloWorldAlert">
        <!-- <h5 style="padding-left:20px;">
          源码地址：
          <a
            href="http://a-1.vip/demo/myPlayer/myDist.zip"
          >http://a-1.vip/demo/myPlayer/myDist.zip</a>
        </h5>-->
        <p class="center">Hello World ~</p>
        <p class="center">欢迎你来体验 Music-Player</p>
        <h5 style="padding-left:20px;">本次更新：</h5>
        <p>[优化] 优化pc端样式</p>
        <h5 style="padding-left:20px;">v1.1.4.20190826</h5>
        <p>[优化] 增强过度效果</p>
        <p>[修复] 已知bug</p>
        <h5 style="padding-left:20px;">v1.1.3.20190824</h5>
        <p>[增加] 移动端滑屏切换(左右)</p>
        <p>[增加] 列表歌曲更新提示</p>
        <p>[增加] 歌单移除功能(长按)</p>
        <p>[增加] 收藏、单曲移除功能</p>
        <p>[增加] 可添加到指定歌单</p>
        <p>[增加] 重置所有数据的功能</p>
        <p>[优化] 歌单封面及列表样式</p>
        <p>[优化] 过滤不必要缓存的数据</p>
        <p>[修复] 跳过无法播放歌曲</p>
        <p>[修复] 已知bug</p>
        <h5 style="padding-left:20px;">v1.0.0.20190813</h5>
        <p>[增加] 可以播放音乐</p>
        <p>[增加] 可以显示歌词</p>
        <p>[其他] 忘了~</p>
      </div>
    </Alert>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Background from "./components/Background.vue";
import PlayControl from "./components/PlayControl.vue";
import SongSearch from "./components/SongSearch.vue";
import { setTimeout } from "timers";
import Alert from "./components/Popup/Prompt/Alert.vue";

export default {
  data() {
    return {
      showHelloWorld: false,
      isShow_search: false,
      musicProgress: 0,
      lyricIndex: -1
    };
  },
  computed: {
    ...mapState(["player"])
  },
  mounted() {
    let versions = localStorage["versions"];
    if (this.player.versions !== versions) {
      this.showHelloWorld = true;
      localStorage["versions"] = this.player.versions;
    }

    this.addSonglistAll();
    this.getData({
      online: false,
      prefix: "Crunchies_",
      id: [3778678, 3779629, 4395559, 64016, 112504, 19723756, 2884035]
    });
    // -----------------------------------------------------------------------
    let beginIndex = 0;
    // musicPlayer -- 播放器dom对象
    // 停止播放
    musicPlayer.onpause = () => {
      this.player.play = false;
    };
    // 开始播放
    musicPlayer.onplay = () => {
      this.player.play = true;
    };
    // 正在播放·进度改变
    musicPlayer.ontimeupdate = () => {
      let total = musicPlayer.duration || 0,
        newTime = musicPlayer.currentTime || 0,
        progress = newTime / total;
      this.musicProgress = progress * 100 || 0;
      let arr = this.player.lyricList,
        len = this.player.lyricList.length;
      for (let i = 0; i < len; i++) {
        let time = arr[i].time / 1000;
        if (newTime > time) {
          beginIndex = i;
        }
      }
      if (beginIndex !== this.lyricIndex) {
        this.lyricIndex = beginIndex;
        this.player.lyricIndex = beginIndex;
        setTimeout(() => {
          // 歌词滚动、
          this.lyricsRoll();
        }, 0);
      }
    };
    // 播放结束
    musicPlayer.onended = () => {
      this.control("next");
    };
  },
  methods: {
    ...mapMutations(["getData", "control", "addSonglistAll"]),
    skip(type) {
      const pageArr = ["player", "nowPlaying", "playlist"];
      let index = pageArr.lastIndexOf(this.$router.history.current.name),
        len = pageArr.length;
      if (type === "left") {
        index--;
        if (index < 0) index = len - 1;
      } else if (type === "right") {
        index++;
        if (index > len - 1) index = 0;
      }
      this.$router.push({
        name: pageArr[index]
      });
    },
    swipeleft() {
      this.skip("left");
    },
    swiperight() {
      this.skip("right");
    },
    message(val) {
      if (!val) return;
      this.$message.error({
        message: val,
        showClose: true,
        customClass: "message"
      });
      this.player.__test_message = "";
    },
    lyricsRoll() {
      // 歌词滚动、
      const domWrap = document.querySelector("#Player>.song-lyric");
      if (!domWrap) {
        return;
      }
      let domActive = document.querySelector(
        "#Player>.song-lyric>ul.lyric>li.active"
      );

      const scrollTop =
        domActive.offsetTop -
        domWrap.offsetTop -
        (domWrap.offsetHeight / 2 - 50);
      // 兼容
      if (domWrap.scrollTo) {
        domWrap.scrollTo({ top: scrollTop, behavior: "smooth" });
      } else {
        document.querySelector("#Player>.song-lyric").scrollTop = scrollTop;
      }
    }
  },
  components: {
    Background,
    PlayControl,
    SongSearch,
    Alert
  }
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

ul > li {
  list-style: none;
}

body .message {
  width: 90%;
  min-width: 300px;
  max-width: 600px;
}

#App {
  height: 100vh;
  overflow: hidden;
  position: relative;
  color: #c5c5c5;
  padding: 0;

  #HelloWorldAlert {
    padding: 10px 0;
    color: #444;
    font-size: 15px;
    p {
      padding-left: 40px;
      margin: 0;
      line-height: 25px;
      color: #999;
    }
    p.center {
      padding-left: 0;
      text-align: center;
    }
  }

  .nav-page {
    display: flex;
    span.nav-btn {
      width: 25vw;
      line-height: 35px;
      text-align: center;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      transition: border-bottom 0.5s;
      color: #c5c5c5;
    }
    span.nav-btn:hover {
      color: #ddd;
    }
    span.nav-btn.router-link-exact-active {
      border-bottom: 3px solid #a2a0a0;
    }
  }

  .wraper {
    width: 100%;
    height: calc(100vh - 38px - 60px);
  }
}
</style>