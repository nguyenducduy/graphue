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
  @Getter("users/accessMenu") accessMenu;
  @Getter("users/isAuth") isAuth;
  @Action("users/logOut") logOut;
  @Mutation("users/UPDATE_ACCESS_MENU") updateAccessMenu;
  @Mutation("SET_ALL_MENU") setAllMenu;

  @Socket()
  connect() {
    console.log("Socket connected...");
    if (this.isAuth) {
      console.log("Check menu change... Check permission change...");

      this.$socket.client.emit("check_menu_permission_change", {
        groupId: this.loggedUser.group.id,
        currentAccessMenu: this.accessMenu
      });
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

  async __logout() {
    this.$nprogress.start();

    try {
      await this.logOut();

      return (window.location.href = `
          ${window.location.protocol}//${window.location.hostname +
        (window.location.port ? ":" + window.location.port : "")}/admin
        `);

      this.$nprogress.done();
    } catch (error) {
      this.$nprogress.done();
    }
  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
