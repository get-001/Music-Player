<template>
  <div id="NowPlaying">
    <div class="list-scroll">
      <table class="table" style="margin:0;">
        <thead>
          <tr>
            <th class="index" style="width:40px;">#</th>
            <th>歌曲</th>
            <th>歌手</th>
            <th class="album">专辑</th>
            <th style="width:40px;"></th>
          </tr>
        </thead>
        <transition-group name="list" tag="tbody">
          <!-- <tbody> -->
          <tr
            v-for="(item, index) in player.songlistAll[player.currentSonglistType].list"
            :key="item.id"
            @click="clickList($event,player.currentSonglistType,index)"
            :class="{current:ShowPlayIco(item.id),
                     sole:ShowPlayIco(item.id,player.currentSonglistType)}"
          >
            <th class="index">
              <span v-if="ShowPlayIco(item.id,player.currentSonglistType)" class="active"></span>
              <span v-else>{{index+1}}</span>
            </th>
            <td>{{item.name}}</td>
            <td>{{item.ar[0].name}}</td>
            <td class="album">{{item.al.name}}</td>
            <td class="btn-wrap">
              <span
                data-type="Collect"
                :class="{active:isActive(item.id)}"
                class="glyphicon glyphicon-heart"
                aria-hidden="true"
              ></span>
              <span data-type="showDetailed" class="glyphicon glyphicon-th-list" aria-hidden="true"></span>
            </td>
          </tr>
          <!-- </tbody> -->
        </transition-group>
      </table>
      <div
        class="but-dlelist"
        v-if="player.songlistAll[player.currentSonglistType].list.length===0"
      >可能是个假列表，什么也没有</div>
      <div
        class="but-dlelist"
        v-if="player.songlistAll[player.currentSonglistType].list.length!==0"
      >
        <span @click="showConfirm=true">清空列表</span>
      </div>
    </div>
    <SongDetailed :songs="songs" v-model="isShow" />
    <Alert
      v-model="showConfirm"
      @AlertResult="emptyList"
      title="清空列表"
      content="  清空后列表上的歌曲不可恢复哦"
      :confirmBtn="true"
      :cancelBtn="true"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { ajaxSong } from "./../components/api.js";
import SongDetailed from "./../components/SongDetailed.vue";
import Alert from "./../components/Popup/Prompt/Alert.vue";
import { type } from "os";

export default {
  name: "NowPlaying",
  computed: {
    ...mapState(["player"])
  },
  data() {
    return {
      isShow: false,
      showConfirm: false,
      songs: {}
    };
  },
  components: { SongDetailed, Alert },
  methods: {
    ...mapMutations([
      "empty",
      "getDataOnly",
      "addSonglistItem",
      "delSonglistItem",
      "init"
    ]),
    isActive(id) {
      const list = this.player.songlistAll["collect"].list;
      let is = list.some(ele => ele.id === id);
      return is;
    },
    emptyList(result) {
      if (!result.execute) return;
      const listType = this.player.currentSonglistType;
      if (this.player.playSong.listType === listType) {
        // 判断被清空的列表为当前播放歌曲所处的列表，为了避免bug。需要初始化
        this.init();
      }
      this.empty(listType);
    },
    clickList(e, listType, index) {
      const type = e.target.getAttribute("data-type");
      if (type === "Collect") {
        // 点击收藏 Collect
        const item = this.player.songlistAll[listType].list[index];
        const is = this.isActive(item.id);
        if (is) {
          this.delSonglistItem({ listType: "collect", id: item.id });
        } else {
          this.addSonglistItem({ listType: "collect", item, up: true });
        }
      } else if (type === "showDetailed") {
        // 点击详细 Detailed
        const item = this.player.songlistAll[listType].list[index];
        ajaxSong.detailed(item, data => {
          this.songs = data;
          this.songs["target"] = {
            listType,
            index,
            item,
            source: "NowPlaying"
          };
          this.isShow = true;
        });
      } else {
        // 点击列表项 ListBoxItem
        this.getDataOnly({ listType, index });
      }
    },
    ShowPlayIco(id, listType) {
      if (!this.player.play) return false;
      if (id !== this.player.playSong.id) return false;
      if (listType) {
        return listType === this.player.playSong.listType;
      } else {
        return true;
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 Alert 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    next(self => {
      let id = to.params.id || self.player.currentSonglistType;
      self.player.currentSonglistType = id;
    });
  }
};
</script>

<style lang="less">
#NowPlaying {
  cursor: default;

  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s;
  }
  .list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
    opacity: 0;
  }
  .list-leave-to {
    transform: translateX(-100%);
  }

  .list-scroll {
    width: 100%;
    height: 100%;
    overflow-y: scroll;

    table {
      tr {
        border-bottom: 1px solid rgba(150, 150, 150, 0.1);
        th,
        td {
          border: none;
          max-width: 80px;
          /* 文字溢出禁止换行 */
          white-space: nowrap;
          /* 超出部分隐藏 */
          overflow: hidden;
          /* 文字溢出部分点点... */
          text-overflow: ellipsis;
        }
        td.btn-wrap {
          padding-left: 0;
          padding-right: 0;
          text-align: center;
          span.glyphicon {
            vertical-align: middle;
            margin: 0 5px;
            cursor: pointer;
          }
          span.glyphicon.glyphicon-heart {
            // color: #fff;
          }
          span.glyphicon.glyphicon-heart.active {
            color: #ff6666;
          }
        }
        @media (max-width: 750px) {
          .album {
            display: none;
          }
        }
        th.index {
          text-align: center;
          .active {
            display: inline-block;
            width: 20px;
            height: 20px;
            background: url("./../assets/images/wave.gif") no-repeat;
            background-size: 60%;
            background-position: center;
            vertical-align: middle;
          }
        }
      }
      tbody > tr.current {
        color: #abd8ab;
      }
      tbody > tr.current.sole {
        color: #fff;
      }
    }
    .but-dlelist {
      text-align: center;
      line-height: 40px;
      border-top: 1px solid rgba(150, 150, 150, 0.1);
      border-bottom: 1px solid rgba(150, 150, 150, 0.1);
      background-color: rgba(0, 0, 0, 0.05);
    }
    .but-dlelist > span:hover {
      cursor: pointer;
    }
  }
}
</style>