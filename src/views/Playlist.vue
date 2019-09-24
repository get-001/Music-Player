<template>
  <div id="Playlist" @click="isShow_operateBox=false">
    <div class="list-scroll">
      <transition-group class="row" style="margin:0;" name="list" tag="div">
        <div
          class="box col-xs-4 col-sm-3 col-md-2 col-lg-2"
          v-for="(item,prop) in player.songlistAll"
          :key="prop"
        >
          <div class="box-wrap" :class="{active:ShowPlayIco(prop)}" v-longtap="longtapBox">
            <span
              class="btn-delete"
              v-if="isShow_operateBox&&isRemove(prop)"
              @click.stop="deleteSonglist(prop)"
            />
            <div class="box-img" @click="skipSonglist(prop)">
              <img
                :src="item.imgUrl"
                onerror="this.src='data:image/png;base64,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'"
              />
            </div>
          </div>
          <p @click="skipSonglist(prop)">
            <span>{{item.title}}</span>
          </p>
        </div>
      </transition-group>
      <div class="btn-addList">
        <ul>
          <li>
            我的歌单
            <span @click="isShow_syncList=true">[点击同步]</span>
          </li>
          <li>
            <span @click="isShow_reset=true">重置所有数据(清空缓存)</span>
          </li>
        </ul>
      </div>
    </div>
    <SyncSonglist v-model="isShow_syncList" />
    <Alert
      v-model="showConfirm"
      @AlertResult="removeSonglist"
      title="移除歌单"
      content="  歌单移除后列表上的歌曲不可恢复哦"
      :confirmBtn="true"
      :cancelBtn="true"
      :data="removeSonglist_key"
    />
    <Alert
      v-model="isShow_reset"
      @AlertResult="resetAllData"
      title="重置所有数据"
      content="  这是个谨慎的操作，你确定要这么做吗？"
      :confirmBtn="true"
      :cancelBtn="true"
      cancelText="不了"
      confirmText="是的(重置)"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import SyncSonglist from "./../components/SyncSonglist.vue";
import Alert from "./../components/Popup/Prompt/Alert.vue";

export default {
  name: "Playlist",
  data() {
    return {
      isShow_syncList: false,
      isShow_operateBox: false,
      removeSonglist_key: "",
      showConfirm: false,
      isShow_reset: false
    };
  },
  computed: {
    ...mapState(["player"])
  },
  methods: {
    ...mapMutations(["delSonglist", "addSonglistItem"]),
    resetAllData(result) {
      if (!result.execute) return;
      // 重置所有数据
      localStorage.clear();
      this.$router.go(0);
    },
    longtapBox(e) {
      e.preventDefault();
      this.isShow_operateBox = true;
    },
    deleteSonglist(key) {
      this.removeSonglist_key = key;
      this.showConfirm = true;
    },
    removeSonglist(result) {
      if (!result.execute) return;
      this.delSonglist({ key: result.data, isUpCache: true });
    },
    isRemove(key) {
      const templateArr = ["recently", "collect"];
      return templateArr.lastIndexOf(key) === -1;
    },
    skipSonglist(id) {
      this.$router.replace({
        name: "nowPlaying",
        params: { id }
      });
    },
    ShowPlayIco(listType) {
      if (!this.player.play) return false;
      return listType === this.player.playSong.listType;
    }
  },
  components: { SyncSonglist, Alert }
};
</script>

<style lang="less">
#Playlist {
  cursor: default;

  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s;
  }
  .list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
    opacity: 0;
  }

  .list-scroll {
    height: 100%;
    overflow-y: scroll;
    padding: 10px 5px;
    .box {
      // 栅格系统
      padding: 10px 0;
      text-align: center;
      .box-wrap {
        display: inline-block;
        position: relative;
        width: 140px;
        height: 140px;
        margin-bottom: 5px;
        cursor: pointer;

        // -------------------------------------
        @keyframes identifier_delete {
          0% {
            padding: 6px;
          }
          50% {
            padding: 2px;
          }
          100% {
            padding: 6px;
          }
        }
        span.btn-delete {
          position: absolute;
          top: -10px;
          right: -10px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          padding: 2px;
          background: #fff;
          // animation: identifier_delete 1.3s infinite;
        }
        span.btn-delete::after {
          content: "";
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #777777;
          transition: background-color 0.5s ease-in-out;
        }
        span.btn-delete:hover::after {
          background-color: #f02930;
        }
        // -------------------------------------

        .box-img {
          overflow: hidden;
          border-radius: 10px;
          width: 100%;
          height: 100%;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }

      .box-wrap.active::before {
        content: "";
        width: 15px;
        height: 15px;
        position: absolute;
        bottom: 10px;
        left: 10px;
        background: url("./../assets/images/wave.gif") no-repeat;
        background-size: 100%;
      }

      p {
        margin: 0;
        padding: 0;
        /* 文字溢出禁止换行 */
        white-space: nowrap;
        /* 超出部分隐藏 */
        overflow: hidden;
        /* 文字溢出部分点点... */
        text-overflow: ellipsis;

        span {
          cursor: pointer;
        }
        span:hover {
          color: #31c27c;
        }
      }
    }

    @media (max-width: 770px) {
      .box {
        font-size: 10px;
        .box-wrap {
          width: 80px;
          height: 80px;
          border-radius: 5px;
        }
        .box-wrap.active::before {
          width: 10px;
          height: 10px;
        }
      }
    }

    .btn-addList {
      padding: 10px 0;
      ul {
        margin: 0;
      }
      ul > li {
        text-align: center;
        line-height: 40px;
        // border-top: 1px solid rgba(150, 150, 150, 0.1);
        border-bottom: 1px solid rgba(150, 150, 150, 0.1);
        background-color: rgba(0, 0, 0, 0.1);
        span {
          cursor: pointer;
        }
        span:hover {
          color: #31c27c;
        }
      }
    }
  }
}
</style>