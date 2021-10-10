<template>
  <figure :title="title" :id="id" :index="index">
    <img :src="src" :alt="title ? title : 'Figure'+index" />
    <figcaption :index="index" :title="title" holder="Figure">
      <span v-if="title" class="caption-title">{{ title }}</span>
      <slot/>
    </figcaption>
  </figure>
</template>

<script>
export default {
  props: ["src", "id", "index", "title"]
};
</script>

<style>
</style>