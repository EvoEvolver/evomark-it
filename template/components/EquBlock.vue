<template>
  <span ref="math"></span>
</template>

<script>

export default {
  inject: ["katexAPI"],
  props: ["tex"],
  mounted() {
    if (this.tex) 
      this.katexAPI.render(this.tex, this.$refs.math, {
        throwOnError: false,
        displayMode: true
      });
  },
  watch: {
    tex: function (val) {
      if (val)
        this.katexAPI.render(val, this.$refs.math, {
          throwOnError: false,
          displayMode: true
        });
    },
  },
};
</script>

<style>
</style>