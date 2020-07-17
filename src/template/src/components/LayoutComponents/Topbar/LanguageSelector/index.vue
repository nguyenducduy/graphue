<template>
  <a-dropdown :trigger="['click']" placement="bottomLeft">
    <div :class="$style.dropdown">
      <strong class="text-uppercase">En</strong>
    </div>
    <a-menu slot="overlay">
      <a-menu-item>
        <span role="img" aria-label="English" class="mr-2">🇬🇧</span>
        English
      </a-menu-item>
      <a-menu-item>
        <span role="img" aria-label="French" class="mr-2">🇫🇷</span>
        French
      </a-menu-item>
      <a-menu-item>
        <span role="img" aria-label="Русский" class="mr-2">🇷🇺</span>
        Русский
      </a-menu-item>
      <a-menu-item>
        <span role="img" aria-label="简体中文" class="mr-2">🇨🇳</span>
        简体中文
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  name: "language-selector"
})
export default class LanguageSelector extends Vue {}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
