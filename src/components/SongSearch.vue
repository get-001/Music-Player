<template>
  <PopupWrap v-if="value" @end="closePopup" title="Music Search">
    <div id="SongSearch">
      <div class="input-group">
        <input type="text" class="form-control" placeholder="搜索歌手、歌名、专辑" v-model="antistop" />
        <div
          class="input-group-addon"
          :class="{'forbid':isAwait}"
          @click="isAwait?null:seek(antistop)"
        >
          <span
            class="glyphicon"
            :class="isAwait?'fa fa-spinner fa-pulse':'glyphicon-search'"
            aria-hidden="true"
          ></span>
        </div>
      </div>
      <div v-if="songlist.length!==0" class="list-scroll">
        <table class="table table-condensed table-striped" style="margin-bottom:0;">
          <thead>
            <tr class="active">
              <th class="index">#</th>
              <th>歌曲</th>
              <th>歌手</th>
              <th class="album">专辑</th>
              <th style="width:30px;text-align:center;"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in songlist"
              :key="index"
              @click="execute($event,item)"
              :class="{info:ShowPlayIco(item.id)}"
            >
              <th class="index">{{index+1}}</th>
              <td>{{item.name}}</td>
              <td>{{item.artist[0]}}</td>
              <td class="album">{{item.album}}</td>
              <td class="box-btn">
                <span
                  class="glyphicon glyphicon-heart"
                  :class="{active:isActive(item.id)}"
                  aria-hidden="true"
                  data-type="collect"
                ></span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </PopupWrap>
</template>

<script>
import PopupWrap from "./Popup/PopupWrap.vue";
import { mapState, mapMutations } from "vuex";
import { get } from "./api.js";

export default {
  name: "SongSearch",
  props: ["value"],
  components: { PopupWrap },
  computed: {
    ...mapState(["player"])
  },
  data() {
    return {
      isAwait: false,
      antistop: "",
      songlist: []
    };
  },
  methods: {
    ...mapMutations(["seekItem"]),
    closePopup() {
      this.isAwait = false;
      this.antistop = "";
      this.songlist = [];
      this.$emit("input", false);
    },
    execute(e, item) {
      if (e.target.getAttribute("data-type") === "collect") {
        // 点击收藏
        this.seekItem({
          item,
          type: "collect",
          cancel: this.isActive(item.id)
        });
      } else {
        // 点击播放
        this.seekItem({ item, type: "play" });
      }
    },
    isActive(id) {
      const list = this.player.songlistAll["collect"].list;
      let is = list.some(ele => ele.id === id);
      return is;
    },
    seek(name) {
      if (!name) return;
      this.isAwait = true;
      get({
        types: "search",
        count: 50,
        source: "netease",
        pages: 1,
        name
      }).then(
        ({ data }) => {
          this.songlist = data;
          this.isAwait = false;
        },
        () => {
          this.isAwait = false;
        }
      );
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
  }
};
</script>

<style lang="less">
#SongSearch {
  .input-group {
    .form-control:focus {
      border-color: #ccc;
      outline: none;
      box-shadow: none;
    }
    .input-group-addon {
      cursor: pointer;
    }
    .input-group-addon.forbid {
      color: #555555;
      cursor: not-allowed;
    }
  }

  .list-scroll {
    margin-top: 10px;
    overflow-y: scroll;
    max-height: calc(100vh - 35px - 180px);
    color: #444;
    table {
      tr {
        @media (max-width: 550px) {
          .album {
            display: none;
          }
        }
        @media (max-width: 350px) {
          .index {
            display: none;
          }
        }
        .index {
          text-align: center;
        }

        th,
        td {
          vertical-align: middle;
        }
        td.box-btn {
          font-size: 0;
          text-align: center;
          span.glyphicon {
            color: #ccc;
            font-size: 14px;
            cursor: pointer;
          }
          span.glyphicon.active {
            color: #ff6666;
          }
        }
      }
    }
  }
}
</style>