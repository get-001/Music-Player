<template>
  <PopupWrap v-if="value" @end="closePopup" title="The songs in detail">
    <div id="SongDetailed">
      <table class="table" style="margin:0;">
        <tbody>
          <tr>
            <th>歌名：</th>
            <td>{{songs.name}}</td>
          </tr>
          <tr>
            <th>歌手：</th>
            <td>{{songs.singer}}</td>
          </tr>
          <tr v-if="songs.name!==songs.album">
            <th>专辑：</th>
            <td>{{songs.album}}</td>
          </tr>
          <tr v-if="songs.time">
            <th>时长：</th>
            <td>{{songs.time | formatting('time')}}</td>
          </tr>
          <tr v-if="songs.publishTime">
            <th>发布：</th>
            <td>{{songs.publishTime | formatting('publishTime')}}</td>
          </tr>
          <tr>
            <th>操作：</th>
            <td class="btn-wrap">
              <span
                class="fa"
                :class="isActive('collect',songs.id)?'fa-heart active':'fa-heart-o'"
                @click="collect(songs)"
              ></span>
              <span class="fa fa-plus-square" @click="showAdd=true"></span>
              <span
                v-if="songs['target'].source==='NowPlaying'&&isActive(songs['target'].listType,songs.id)"
                class="fa fa-trash-o"
                @click="dleSonglist(songs)"
              ></span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="songs.url" style="margin-top:5px;">
        <div class="input-group" style="margin-bottom:5px;">
          <label class="input-group-addon" style="color:#444;" for="music_20190824092504">
            <span class="glyphicon glyphicon-music" aria-hidden="true"></span>
          </label>
          <input
            class="form-control"
            type="text"
            placeholder="Song file name"
            :value="songs.singer+' - '+songs.name"
            onfocus="this.select()"
            id="music_20190824092504"
          />
        </div>
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            placeholder="Songs address"
            :value="songs.url"
            onfocus="this.select()"
          />
          <div
            class="input-group-addon"
            :class="{'forbid':isAwait}"
            @click="isAwait?null:download(songs.url,`${songs.singer} - ${songs.name}`)"
          >
            <span :class="isAwait?'fa fa-spinner fa-pulse':'fa fa-download'"></span>
          </div>
        </div>
        <div class="wrap-lyrie" style="margin-top:5px;" v-show="songs.lyric">
          <!-- lyricList -->
          <!-- <div class="lyric" style="white-space:pre-line;">{{songs.lyric}}</div> -->
          <ul>
            <li v-for="(item, index) in songs.lyricList" :key="index">
              <!-- <span class="time">{{item.time/1000|formatting('time')}}</span>
              <span class="content">{{item.content}}</span>-->
              <p>{{item.content}}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <selectSonglist v-model="showAdd" @listClick="addAssignSonglist($event,songs)" />
  </PopupWrap>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import PopupWrap from "./Popup/PopupWrap.vue";
import selectSonglist from "./selectSonglist.vue";

export default {
  name: "SongDetailed",
  props: ["value", "songs"],
  components: { PopupWrap, selectSonglist },
  computed: {
    ...mapState(["player"])
  },
  data() {
    return {
      isAwait: false,
      showAdd: false
    };
  },
  filters: {
    formatting(value, type) {
      const formatDate = now => {
          let year = now.getFullYear(), //取得4位数的年份
            month = now.getMonth() + 1, //取得日期中的月份，其中0表示1月，11表示12月
            date = now.getDate(); //返回日期月份中的天数（1到31）
          return format(year, 4) + "-" + format(month) + "-" + format(date);
        },
        formatTime = now => {
          return format(parseInt(now / 60)) + ":" + format(parseInt(now % 60));
        },
        format = (num, entries = 2) => {
          return ("00000" + num).slice(-entries);
        };
      if (type === "time") {
        return formatTime(value);
      } else if (type === "publishTime") {
        return formatDate(new Date(value));
      }
    }
  },
  methods: {
    ...mapMutations(["addSonglistItem", "dleSonglistItem"]),
    isActive(listType, id) {
      const list = this.player.songlistAll[listType].list;
      return list.some(ele => ele.id === id);
    },
    collect(songs) {
      const listType = "collect";
      // songs.target.item 为没有加工之前的数据，适合添加到列表、
      const item = songs.target.item;
      if (this.isActive("collect", item.id)) {
        this.dleSonglistItem({ listType, id: item.id });
      } else {
        this.addSonglistItem({ listType, item, up: true });
      }
    },
    dleSonglist(songs) {
      const listType = songs.target.listType;
      this.dleSonglistItem({ listType, id: songs.id });
      this.closePopup();
      this.$message({
        message: "已移除：" + songs.singer + " - " + songs.name,
        type: "success",
        showClose: true,
        customClass: "message"
      });
    },
    closePopup() {
      this.$emit("input", false);
    },
    closePopupAdd() {
      this.showAdd = false;
    },
    addAssignSonglist(prop, songs) {
      // songs.target.item 为没有加工之前的数据，适合添加到列表、
      const item = songs.target.item;
      this.addSonglistItem({ listType: prop, item, up: true });
      this.$message({
        message: "已添加至指定歌单",
        type: "success",
        showClose: true,
        customClass: "message"
      });
    },
    download(url, songName) {
      this.isAwait = true;
      // axios 下载文件（自定义文件名）
      axios.get(url, { responseType: "blob" }).then(
        res => {
          let blob = new Blob([res.data]);
          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = songName + ".mp3"; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放blob对象
          this.isAwait = false;
        },
        err => {
          this.isAwait = false;
        }
      );
    }
  }
};
</script>

<style lang="less">
#SongDetailed {
  padding: 0;
  table {
    tr {
      th {
        width: 80px;
        text-align: right;
      }
      th,
      td {
        color: #444;
        border-bottom: 1px solid #ddd;
        line-height: 20px;
      }

      td.btn-wrap {
        padding-left: 0;
        padding-right: 0;
        text-align: left;
        span {
          vertical-align: middle;
          margin: 0 5px;
          cursor: pointer;
        }
        span.active {
          color: #ff6666;
        }
      }
    }
  }

  div.input-group {
    .form-control:focus {
      border-color: #ccc;
      outline: none;
      box-shadow: none;
    }
    .input-group-addon {
      cursor: pointer;
      padding: 0 10px;
      font-size: 15px;
      color: #51a2f9;
    }
    .input-group-addon.forbid {
      color: #555555;
      cursor: not-allowed;
    }
  }

  .wrap-lyrie {
    margin-top: 15px;
    overflow-y: scroll;
    max-height: 200px;
    color: #c5c5c5;

    ul > li {
      span {
        display: inline-block;
        text-align: center;
        vertical-align: middle;
      }
      span.time {
        width: 50px;
      }
      span.content {
        width: calc(100% - 50px);
      }
      p {
        text-align: center;
        margin: 2px 0;
        border-bottom: 1px solid #eee;
      }
    }
  }
}
</style>