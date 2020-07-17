<template>
  <div style="width: 100%; height: 100%">
    <router-view />
    <div :class="[$style.footer, 'text-center text-xl']">
      <p>&copy; 2020 Graphue. All rights reserved.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Mutation, State } from "vuex-class";

@Component
export default class LoginLayout extends Vue {}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
