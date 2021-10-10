<template>
  <div class="tooltip">
    <slot></slot>
    <div :class="showTip ? 'tooltiptext' : 'hide'">
      <slot name="tip"> </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showTip: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="sass" scoped>
$tip-width: 500px
$box-color: rgba(0,0,0,0.8)
.tooltip
    position: relative
    display: inline-block
    color: #0084d1

    & .tooltiptext
        visibility: hidden
        width: $tip-width
        background-color: $box-color
        color: #fff
        padding: 5px 5px
        border-radius: 6px

        position: absolute
        z-index: 1
        bottom: 95%
        left: 0%
        margin-left: (-$tip-width*0.5)

        opacity: 0
        transition: opacity 0.3s

    &:hover .tooltiptext
        visibility: visible
        opacity: 1
        transition-delay: 0.5s

    &:hover .hide
        visibility: hidden
</style>