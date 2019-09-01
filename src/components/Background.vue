<template>
  <div id="Background">
    <img class="image" :src="image" />
    <div class="overspread" :style="{opacity: opaqueness}" />
  </div>
</template>

<script>
export default {
  props: ["image"],
  data() {
    return {
      opaqueness: "0.3"
    };
  }
};
</script>

<style lang="less">
#Background {
  z-index: -100;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(200deg, #7f7280, #000000);
}
#Background > .image {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(10px);
}
#Background > .overspread {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.3;
}
</style>