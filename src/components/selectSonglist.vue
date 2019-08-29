<template>
  <!--  @end="closePopupAdd" -->
  <PopupWrap v-if="value" @end="closePopup" title="添加到歌单">
    <div id="selectSonglist">
      <ul>
        <li v-for="(item,prop) in player.songlistAll" :key="prop" @click="listClick(prop)">
          <img
            :src="item.imgUrl"
            onerror="this.src='data:image/png;base64,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'"
          />
          <span class="title">{{item.title}}</span>
        </li>
      </ul>
    </div>
  </PopupWrap>
</template><script>
import { mapState } from "vuex";
import PopupWrap from "./Popup/PopupWrap.vue";
export default {
  name: "selectSonglist",
  props: ["value"],
  components: { PopupWrap },
  methods: {
    closePopup() {
      this.$emit("input", false);
    },
    listClick(prop) {
      this.$emit("listClick", prop);
      this.closePopup();
    }
  },
  computed: {
    ...mapState(["player"])
  }
};
</script>

<style lang="less">
#selectSonglist {
  color: #444;
  ul {
    margin: 0;
  }
  ul > li {
    margin-bottom: 5px;
    cursor: pointer;
    transition: background-color 0.5s;

    /* 文字溢出禁止换行 */
    white-space: nowrap;
    /* 超出部分隐藏 */
    overflow: hidden;
    /* 文字溢出部分点点... */
    text-overflow: ellipsis;

    img {
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
    .title {
      font-weight: 600;
    }
  }
  ul > li:last-of-type {
    margin-bottom: 0;
  }
  ul > li:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}
</style>