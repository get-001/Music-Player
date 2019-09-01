<template>
  <transition name="fade">
    <div id="PopupWrap" v-swipeleft.stop="()=>{}" v-swiperight.stop="()=>{}">
      <div class="shade" v-on:click.stop="end"></div>
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title">
            {{title}}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true" @click="end">&times;</span>
            </button>
          </h3>
        </div>
        <div class="panel-body">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: ["title"],
  methods: {
    end() {
      this.$emit("end");
      return false;
    }
  }
};
</script>

<style lang="less">
// .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

@keyframes identifier {
  0% {
    opacity: 0;
    filter: blur(5px);
  }
  100% {
    opacity: 1;
    filter: blur(0);
  }
}
#PopupWrap {
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 45px 10px 0 10px;
  overflow: hidden;
  cursor: default;

  .panel {
    animation: identifier 0.5s;
    margin: 0 auto;
    max-width: 900px;

    .panel-body {
      margin: 5px 0;
      padding: 0 5px;
      overflow-y: scroll;
      max-height: calc(100vh - 35px - 110px);
    }
    /* ········· ········· 设置滚动条的样式 ········· ········· */
    .panel-body::-webkit-scrollbar {
      /* 滚动条整体样式 */
      width: 0;
      height: 0;
    }
  }
}
#PopupWrap > .shade {
  z-index: -1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
</style>