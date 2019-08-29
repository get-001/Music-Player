<template>
  <div id="Player">
    <div class="song-cover">
      <!-- onerror：监听图片是否加载失败(网络卡或者图片不存在)时触发该事件。 -->
      <img
        :src="player.cover_imgSrc"
        onerror="this.src='data:image/png;base64,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'"
      />
    </div>
    <div class="song-lyric">
      <ul class="lyric">
        <li
          v-for="(item, index) in player.lyricList"
          :key="index"
          :class="{'active':player.lyricIndex===index}"
        >{{item.content}}</li>
      </ul>
    </div>
    <button
      type="button"
      class="btn btn-default btn-SongDetailed"
      aria-label="Left Align"
      v-show="player.playSong.id"
      @click="showSongDetails(player.playSong.listType,player.playSong.index)"
    >
      <span class="glyphicon glyphicon-music" aria-hidden="true"></span>
    </button>
    <SongDetailed :songs="songs" v-model="isShow" />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { ajaxSong } from "./../components/api.js";
import SongDetailed from "./../components/SongDetailed.vue";

export default {
  name: "Player",
  data() {
    return {
      isShow: false,
      songs: {}
    };
  },
  computed: {
    ...mapState(["player"])
  },
  components: { SongDetailed },
  methods: {
    showSongDetails(listType, index) {
      const item = this.player.songlistAll[listType].list[index];
      ajaxSong.detailed(item, data => {
        this.songs = data;
        this.songs["target"] = { listType, index, item, source: "Player" };
        this.isShow = true;
      });
    }
  }
};
</script>


<style lang="less">
#Player {
  position: relative;
  cursor: default;
  overflow: hidden;

  .btn-SongDetailed {
    position: absolute;
    right: 15px;
    bottom: 5px;
    padding: 4px 10px;
  }

  .song-cover {
    margin: 15px auto;
    position: relative;
    width: 186px;
    height: 186px;
  }
  .song-cover > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .song-cover::after {
    content: "";
    position: absolute;
    top: 0;
    left: 9px;
    height: 180px;
    width: 201px;
    background-image: url("./../assets/images/album_cover_player.png");
    background-repeat: no-repeat;
  }
  .song-lyric {
    height: calc(100% - 216px);
    // background: #fff;
    padding: 0 10px;
    overflow-y: scroll;
    ul.lyric {
      li {
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 27px;
      }
      li.active {
        color: #ee9;
      }
    }
  }
  /* ········· ········· 设置滚动条的样式 ········· ········· */
  .song-lyric::-webkit-scrollbar {
    /* 滚动条整体样式 */
    width: 0;
  }
}
</style>
