<template>
  <a-dropdown :trigger="['click']" placement="bottomLeft">
    <div :class="$style.dropdown">
      <strong>
        {{ languageIcons[currentLang] }}
        {{ languageLabels[currentLang] }}
      </strong>
    </div>
    <a-menu slot="overlay" :selectedKeys="[currentLang]" @click="changeLang">
      <a-menu-item v-for="locale in locales" :key="locale">
        <span role="img" :aria-label="locale" class="mr-2">
          {{ languageIcons[locale] }}
        </span>
        {{ languageLabels[locale] }}
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { i18nRender } from "@/locales";
import { State, Mutation } from "vuex-class";

@Component({
  name: "language-selector"
})
export default class LanguageSelector extends Vue {
  @State(state => state.lang) currentLang;
  @Mutation("CHANGE_LOCALE") changeLocale;

  locales: any = ["en-US", "vi-VN"];
  languageLabels: any = {
    "en-US": "English",
    "vi-VN": "Tiếng việt"
  };
  // https://www.alt-codes.net/flags
  languageIcons = {
    "en-US": "🇺🇸",
    "vi-VN": "🇻🇳"
  };

  changeLang({ key }) {
    this.changeLocale(key);
  }
}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
