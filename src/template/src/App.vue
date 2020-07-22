<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Action, Mutation, Getter } from "vuex-class";
import { Socket } from "vue-socket.io-extended";

@Component({
  name: "app-page"
})
export default class App extends Vue {
  @Getter("users/loggedUser") loggedUser;
  @Getter("users/isAuth") isAuth;
  @Mutation("users/UPDATE_ACCESS_MENU") updateAccessMenu;
  @Mutation("SET_ALL_MENU") setAllMenu;
  @Mutation("SET_ABILITY") setAbility;

  @Socket()
  connect() {
    console.log("Socket connected...");
    if (this.isAuth) {
      this.$socket.client.emit(
        "check_menu_permission_change",
        this.loggedUser.group.id
      );
    }
  }

  @Socket()
  grant_permission_change(groupId, accessPermissions) {
    if (+this.loggedUser.group.id === groupId) {
      Vue.ls.set("Access-Permission", accessPermissions);
      this.setAbility(accessPermissions);
    }
  }

  @Socket()
  assign_menu_change(groupId, accessMenus) {
    // receive for current user group
    if (+this.loggedUser.group.id === groupId) {
      this.updateAccessMenu(accessMenus);
    }
  }

  @Socket()
  menu_change(data) {
    let menuTree = [];
    menuTree.push({
      node: data
    });

    this.setAllMenu(menuTree);
  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
