<template>
  <PopupWrap v-if="value" :title="title||'温馨提示'" @end="closePopup(false)">
    <div class="Alert">
      <p v-if="content" class="content">{{content}}</p>
      <slot />
      <div class="btn-wraper" v-if="cancelBtn||confirmBtn">
        <button
          type="button"
          v-if="cancelBtn"
          class="btn btn-default"
          @click="closePopup(false)"
        >{{cancelText||'取消'}}</button>
        <button
          type="button"
          v-if="confirmBtn"
          class="btn btn-info"
          @click="closePopup(true)"
        >{{confirmText||'确定'}}</button>
      </div>
    </div>
  </PopupWrap>
</template>

<script>
import PopupWrap from "./../PopupWrap.vue";
export default {
  props: [
    "data",
    "value",
    "title",
    "content",
    "cancelText",
    "confirmText",
    "confirmBtn",
    "cancelBtn"
  ],
  components: { PopupWrap },
  methods: {
    closePopup(result) {
      this.$emit("input", false);
      this.$emit("AlertResult", { execute: result, data: this.data });
    }
  }
};
</script>

<style lang="less">
.content {
  margin-bottom: 5px;
  color: #444;
  font-size: 15px;
  // white-space: pre;
}
.btn-wraper {
  text-align: right;
  button {
    margin-left: 5px;
    cursor: pointer;
  }
}
</style>