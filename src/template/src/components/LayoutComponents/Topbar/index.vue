<template>
  <div :class="$style.topbar">
    <profile-menu />
    <language-selector class="mr-4" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ProfileMenu from "@/components/LayoutComponents/Topbar/ProfileMenu/index.vue";
import LanguageSelector from "@/components/LayoutComponents/Topbar/LanguageSelector/index.vue";

@Component({
  name: "topbar",
  components: {
    ProfileMenu,
    LanguageSelector
  }
})
export default class Topbar extends Vue {}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
