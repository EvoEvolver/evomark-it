<template>
  <HoverTip @mouseenter="loadTip()" @click="loadTip()" :showTip="hasContent">
    <slot></slot>
    <template v-slot:tip>
      <div ref="targetList" class="preview-box"></div>
    </template>
  </HoverTip>
</template>

<script>
import HoverTip from "./HoverTip.vue";
export default {
  data() {
    return {
      needLoad: true,
      hasContent: false,
    };
  },
  props: ["target"],
  components: {
    HoverTip: HoverTip,
  },
  methods: {
    loadTip() {
      if (!this.needLoad) {
        return;
      }
      let hasContent = false;
      let needLoad = false;
      let targetList = this.$refs.targetList;
      targetList.innerHTML = "";
      for (let id of this.target) {
        let targetNode = document.getElementById(id);
        if (!targetNode) {
          needLoad = true;
          continue;
        }
        targetList.appendChild(targetNode.cloneNode(true));
        hasContent = true;
      }
      this.needLoad = needLoad;
      this.hasContent = hasContent;
    },
  },
};
</script>

<style>
</style>