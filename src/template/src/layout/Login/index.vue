<template>
  <div style="width: 100%; height: 100%">
    <router-view />
    <div :class="[$style.footer, 'text-center text-xl']">
      <p>&copy; 2020 {{ title }}. All rights reserved.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Mutation, State } from 'vuex-class'
import settings from '@/config/settings'

@Component
export default class LoginLayout extends Vue {
  @Mutation('settings/CHANGE_SETTING') changeSetting

  get title() {
    return settings.title
  }

  mounted() {
    this.changeSetting({ setting: 'isMenuCollapsed', value: true })
  }
}
</script>

<style lang="scss" module>
@import './style.module.scss';
</style>
