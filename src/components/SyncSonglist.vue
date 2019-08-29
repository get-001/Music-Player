<template>
  <PopupWrap v-if="value" @end="closePopup" title="Synchronized songs">
    <div id="SyncSonglist">
      <div class="input-group">
        <input type="text" class="form-control" placeholder="请输入您的网易云 UID" v-model="UID" />
        <div
          class="input-group-addon"
          :class="{'forbid':isAwait}"
          @click="isAwait?null:getUID(UID)"
        >
          <span
            class="glyphicon"
            :class="isAwait?'fa fa-spinner fa-pulse':'glyphicon-cloud-download'"
            aria-hidden="true"
          ></span>
        </div>
      </div>
      <div v-if="uidList.length!==0" class="wrap-scroll" style="margin-top:10px;">
        <ul>
          <li v-for="(item,index) in uidList" :key="index">
            <img :src="item.coverImgUrl+'?param=50y50'" />
            <span>{{item.name}}</span>
            <div class="isSelect">
              <input type="checkbox" v-model="selectArr[index]" />
            </div>
          </li>
        </ul>
        <div class="extractionSelect" style="margin-top:10px;text-align:right;">
          <button type="submit" class="btn btn-sm btn-default" @click="ImportSong(selectArr)">导入歌单</button>
        </div>
      </div>
    </div>
  </PopupWrap>
</template>

<script>
import PopupWrap from "./Popup/PopupWrap.vue";
import { mapState, mapMutations } from "vuex";
import { get } from "@/components/api.js";
import { setInterval } from "timers";

export default {
  name: "SyncSonglist",
  components: { PopupWrap },
  props: ["value"],
  data() {
    return {
      isAwait: false,
      UID: "445746067",
      uidList: [],
      selectArr: []
    };
  },
  computed: {
    ...mapState(["player"])
  },
  methods: {
    ...mapMutations(["getData"]),
    ImportSong(arr) {
      const idArr = [];
      arr.forEach((ele, index) => {
        if (ele === true) idArr.push(this.uidList[index].id);
      });
      this.getData({
        online: true,
        prefix: "UID_",
        id: idArr
      });
      this.closePopup();
    },
    closePopup() {
      this.isAwait = false;
      this.UID = "";
      this.uidList = [];
      this.selectArr = [];
      this.$emit("input", false);
    },
    getUID(uid) {
      if (!uid) return;
      this.isAwait = true;
      get({
        types: "userlist",
        uid
      }).then(
        ({ data }) => {
          this.isAwait = false;
          this.uidList = data.playlist;
          for (let i = 0; i < data.playlist.length; i++) {
            this.selectArr[i] = true;
          }
        },
        () => {
          this.isAwait = false;
        }
      );
    }
  }
};
</script>

<style lang="less">
#SyncSonglist {
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
  .wrap-scroll {
    margin-top: 10px;
    overflow-y: scroll;
    max-height: calc(100vh - 35px - 180px);

    ul {
      margin: 0;
    }
    ul > li {
      padding-bottom: 10px;
      font-size: 0;

      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
      span {
        display: inline-block;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        font-weight: 600;
        color: #444;
        width: calc(100% - 60px - 30px);
        vertical-align: middle;
        /* 文字溢出禁止换行 */
        white-space: nowrap;
        /* 超出部分隐藏 */
        overflow: hidden;
        /* 文字溢出部分点点... */
        text-overflow: ellipsis;
        margin-right: 10px;
      }
      .isSelect {
        display: inline-block;
        height: 50px;
        width: 20px;
        vertical-align: middle;
        text-align: center;
        height: 100%;
      }
    }
    ul > li:last-of-type {
      padding-bottom: 0;
    }
  }
  // /* ········· ········· 设置滚动条的样式 ········· ········· */
  // .wrap-scroll::-webkit-scrollbar {
  //   /* 滚动条整体样式 */
  //   width: 4px;
  //   height: 0;
  // }

  // .wrap-scroll::-webkit-scrollbar-thumb {
  //   /* 滚动条里面小方块 */
  //   border-radius: 4px;
  //   background: rgba(200, 200, 200, 0.2);
  // }

  // .wrap-scroll::-webkit-scrollbar-thumb:hover {
  //   /* 滚动条里面小方块 鼠标悬浮样式 */
  //   background: rgba(200, 200, 200, 0.4);
  // }
}
</style>