<template>
  <div>
    <div :class="$style.logo">
      <div :class="$style.logoContainer">
        <img src="/images/logo.png" alt />
      </div>
    </div>
    <div :class="[$style.navigation, $style.light]">
      <vue-custom-scrollbar
        :class="
          settings.isMobileView
            ? $style.scrollbarMobile
            : $style.scrollbarDesktop
        "
      >
        <a-menu
          ref="menu"
          :inlineCollapsed="withDrawer ? false : settings.isMenuCollapsed"
          mode="inline"
          @click="onClick"
          @openChange="onOpenChange"
          :selectedKeys="selectedKeys"
          :openKeys.sync="openKeys"
        >
          <template v-for="item in items">
            <a-menu-item
              :key="`${item.id}-${item.path}`"
              v-if="
                typeof item.children === 'undefined' ||
                  (item.children.length == 0 &&
                    accessMenu.some(e => e.id == item.id))
              "
            >
              <router-link v-if="item.path !== ''" :to="item.path">
                <i v-if="item.icon" :class="[$style.icon, item.icon]"></i>
                <span :class="$style.title">{{ item.name }}</span>
              </router-link>
              <span v-else>
                <i v-if="item.icon" :class="[$style.icon, item.icon]"></i>
                <span :class="$style.title">{{ item.name }}</span>
              </span>
            </a-menu-item>

            <a-sub-menu
              v-if="
                typeof item.children !== 'undefined' &&
                  item.children.length > 0 &&
                  accessMenu.some(e => e.id == item.id)
              "
              :key="`${item.id}-${item.path}`"
            >
              <span slot="title">
                <span :class="$style.title">{{ item.name }}</span>
                <i v-if="item.icon" :class="[$style.icon, item.icon]"></i>
              </span>
              <template v-for="child in item.children">
                <a-menu-item
                  :key="`${child.id}-${child.path}`"
                  v-if="accessMenu.some(e => e.id == child.id)"
                >
                  <router-link v-if="child.path !== ''" :to="child.path">
                    <span :class="$style.title">{{ child.name }}</span>
                  </router-link>
                  <span v-else>
                    <span :class="$style.title">{{ child.name }}</span>
                  </span>
                </a-menu-item>
              </template>
            </a-sub-menu>
          </template>
        </a-menu>
      </vue-custom-scrollbar>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Mutation, Getter } from "vuex-class";
import vueCustomScrollbar from "vue-custom-scrollbar";
import find from "lodash/find";

@Component({
  name: "menu-left",
  components: {
    vueCustomScrollbar
  }
})
export default class MenuLeft extends Vue {
  @Prop() settings;
  @Prop() withDrawer;
  @Mutation("SET") storeSet;
  @Watch("$route")
  routeChange() {
    this.setSelectedKeys();
  }

  @Getter("openKeys") getOpenKeys;
  @Getter("selectedKeys") getSelectedKeys;
  @Getter("allMenu") allMenu;
  @Getter("users/accessMenu") accessMenu;
  @Getter("users/loggedUser") loggedUser;
  @Getter("settings/isMenuCollapsed") isMenuCollapsed;

  get items() {
    return this.allMenu[0]["node"]["children"];
  }

  selectedKeys: any = [];
  openKeys: any = [];

  onClick(e) {
    this.storeSet({ app: "menu.selectedKeys", value: [e.key] });
    this.selectedKeys = [e.key];
  }
  onOpenChange(openKeys) {
    this.storeSet({ app: "menu.openedKeys", value: openKeys });
    this.openKeys = openKeys;
  }
  setSelectedKeys() {
    const pathname = this.$route.fullPath;
    const menuData = this.items.concat();

    const flattenItems = (items, key) =>
      items.reduce((flattenedItems, item) => {
        flattenedItems.push(item);

        if (Array.isArray(item[key])) {
          return flattenedItems.concat(flattenItems(item[key], key));
        }

        return flattenedItems;
      }, []);

    const selectedItem = find(flattenItems(menuData, "children"), [
      "path",
      pathname
    ]);

    this.selectedKeys = selectedItem
      ? [selectedItem.id + "-" + selectedItem.path]
      : [];

    if (this.isMenuCollapsed === false) {
      this.openKeys = [selectedItem.parentId + "-"];
    }
  }

  created() {
    this.openKeys = this.getOpenKeys;
    this.selectedKeys = this.getSelectedKeys;
    this.setSelectedKeys();
  }
}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
