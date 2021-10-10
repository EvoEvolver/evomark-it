<template>
<!--<router-link v-for="value,key of $router.options.routes" :to="value.path" :key="key"> {{value.name}}</router-link>-->
  <router-view v-slot="{ Component }">
    <article>
        <component :is="Component" />
    </article>
  </router-view>

</template>

<script>

export default {
}


</script>

<style lang="sass" src="../style/evomark.sass">
</style>

