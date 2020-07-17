<template>
  <a-layout>
    <a-layout-sider
      theme="light"
      v-if="!settings.isMobileView"
      :width="256"
      collapsible
      :collapsed="settings.isMenuCollapsed"
      @collapse="onCollapse"
    >
      <menu-left :settings="settings" :withDrawer="false" />
    </a-layout-sider>

    <!-- menu mobile -->
    <div v-if="settings.isMobileView">
      <div :class="$style.handler" @click="toggleMobileMenu">
        <div :class="$style.handlerIcon"></div>
      </div>
      <a-drawer
        :closable="false"
        :visible="settings.isMobileMenuOpen"
        placement="left"
        :wrapClassName="$style.mobileMenu"
        @close="toggleMobileMenu"
      >
        <menu-left :settings="settings" :withDrawer="true" />
      </a-drawer>
    </div>
    <a-layout>
      <a-layout-header>
        <topbar />
      </a-layout-header>
      <a-layout-content>
        <router-view />
      </a-layout-content>
      <a-layout-footer class="mt-10">
        <a-back-top />
        <vu-footer />
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Mutation, State } from "vuex-class";
import MenuLeft from "@/components/LayoutComponents/Menu/MenuLeft/index.vue";
import Topbar from "@/components/LayoutComponents/Topbar/index.vue";
import VuFooter from "@/components/LayoutComponents/Footer/index.vue";

@Component({
  name: "admin-layout",
  components: {
    MenuLeft,
    Topbar,
    VuFooter
  }
})
export default class AdminLayout extends Vue {
  @State(state => state.settings) settings;
  @Mutation("settings/CHANGE_SETTING") changeSetting;

  toggleMobileMenu() {
    const value = !this.settings["isMobileMenuOpen"];
    this.changeSetting({ setting: "isMobileMenuOpen", value });
  }

  onCollapse(collapsed, type) {
    const value: any = !this.settings["isMenuCollapsed"];
    this.changeSetting({ setting: "isMenuCollapsed", value });
  }
  setViewPort(isMobileView = false, isTabletView = false) {
    this.changeSetting({ setting: "isMobileView", value: isMobileView });
    this.changeSetting({ setting: "isTabletView", value: isTabletView });
  }
  detectViewPort(firstLoad = false) {
    const isMobile = this.settings["isMobileView"];
    const isTablet = this.settings["isTabletView"];
    const width = window.innerWidth;
    const state = {
      next: {
        mobile: width < 768,
        tablet: width < 992,
        desktop: !(width < 768) && !(width < 992)
      },
      prev: {
        mobile: isMobile,
        tablet: isTablet,
        desktop: !isMobile && !isTablet
      }
    };

    // desktop
    if (
      state.next.desktop &&
      (state.next.desktop !== state.prev.desktop || firstLoad)
    ) {
      this.setViewPort(false, false);
      this.changeSetting({ setting: "isMenuCollapsed", value: true });
    }
    // tablet & collapse menu
    if (
      state.next.tablet &&
      !state.next.mobile &&
      (state.next.tablet !== state.prev.tablet || firstLoad)
    ) {
      this.setViewPort(false, true);
      this.changeSetting({ setting: "isMenuCollapsed", value: true });
    }
    // mobile
    if (
      state.next.mobile &&
      (state.next.mobile !== state.prev.mobile || firstLoad)
    ) {
      this.setViewPort(true, false);
    }
  }
  detectViewPortListener() {
    this.detectViewPort(false);
  }

  mounted() {
    this.detectViewPort(true);
    window.addEventListener("resize", this.detectViewPortListener);
    this.changeSetting({ setting: "isMenuCollapsed", value: true });
  }

  beforeDestroy() {
    window.removeEventListener("resize", this.detectViewPortListener);
  }
}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
