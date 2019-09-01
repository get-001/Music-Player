<template>
  <div id="PlayControl">
    <div class="btn-control">
      <span class="fa-step-backward" @click="control('prev')"></span>
      <span class="fa-play" v-show="!player.play" @click="control('play')"></span>
      <span class="fa-pause" v-show="player.play" @click="control('pause')"></span>
      <span class="fa-step-forward" @click="control('next')"></span>
    </div>
    <div class="scrollBar">
      <span @mousedown="progressBar($event)">
        <i :style="'width:'+(musicProgress||value)+'%'"></i>
      </span>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  props: ["value"],
  data() {
    return {
      musicProgress: ""
    };
  },
  computed: {
    ...mapState(["player"])
  },
  methods: {
    ...mapMutations(["control"]),
    progressBar(event) {
      let currentTarget = event.currentTarget,
        width = currentTarget.offsetWidth,
        left = $(currentTarget).offset().left,
        offsetX =
          event.offsetX < 0 ? 0 : event.offsetX > width ? width : event.offsetX,
        progress = offsetX / width;
      document.onmousemove = e => {
        offsetX = e.pageX - left;
        offsetX = offsetX < 0 ? 0 : offsetX > width ? width : offsetX;
        progress = offsetX / width;
        this.musicProgress = String(progress * 100);
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
        let total = musicPlayer.duration || 0,
          newTime = musicPlayer.currentTime || 0;
        musicPlayer.currentTime = progress * total;
        this.$emit("inpue", progress * 100);
        this.musicProgress = "";
      };
    }
  }
};
</script>

<style lang="less">
#PlayControl {
  // background: rgba(100, 128, 170, 0.39);
  //   background: rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 60px;
  font-size: 0;
  display: flex;
  padding: 0 10px;

  .btn-control {
    display: inline-block;
    padding-top: 17px;
    height: 100%;
  }
  .btn-control > span {
    display: inline-block;
    margin: 0 5px;
    width: 25px;
    font-size: 20px;
    color: #fff;
    font-family: FontAwesome;
    text-align: center;
    // background-color: rgba(255, 0, 0, 0.459);
    // background-image: url("./../assets/images/player.png");
    // background-repeat: no-repeat;
  }
  .scrollBar {
    flex-grow: 1;
    padding-left: 10px;
  }
  .scrollBar > span {
    display: block;
    height: 3px;
    background: #808284;
    border-radius: 2px;
    margin-top: 29px;
  }
  .scrollBar > span > i {
    position: relative;
    display: block;
    background: #fff;
    height: 3px;
    width: 0%;
  }
  .scrollBar > span > i::after {
    content: "";
    display: block;
    position: absolute;
    top: -3px;
    right: -4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #fff;
  }
}
</style>