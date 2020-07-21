<template>
  <a-dropdown :trigger="['click']" placement="bottomLeft">
    <div :class="$style.dropdown">
      <!-- <a-badge :count="99"> -->
      <a-avatar
        v-if="loggedUser.avatar !== null"
        :src="__getAvatar(loggedUser.avatar)"
        :class="$style.avatar"
      />
      <a-avatar
        v-else
        :style="`backgroundColor: ${loggedUser.status.color}`"
        :class="$style.avatar"
      >{{ loggedUser.fullName[0] }}</a-avatar>
      <!-- </a-badge> -->
    </div>
    <a-menu slot="overlay">
      <a-menu-item>
        <div>
          Xin chào,
          <strong>{{ loggedUser.fullName }}</strong>
          <p class="mt-1">
            You logged in as
            <a-tag :color="loggedUser.group.color">{{ loggedUser.group.screenName }}</a-tag>
          </p>
        </div>
      </a-menu-item>
      <a-menu-divider />
      <a-menu-item>
        <div :style="`color: ${loggedUser.group.color}`">
          <i :class="$style.menuIcon" class="fa fa-envelope-o"></i>
          {{ loggedUser.email }}
        </div>
      </a-menu-item>
      <a-menu-divider />
      <a-menu-item>
        <router-link to="/admin/user/changepassword">
          <i :class="$style.menuIcon" class="fa fa-key"></i> Đổi mật khẩu
        </router-link>
      </a-menu-item>
      <a-menu-item>
        <a href="javascript: void(0);" @click="onLogout">
          <i :class="$style.menuIcon" class="fa fa-sign-out"></i> Đăng xuất
        </a>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { GET_USER, LOGOUT_USER } from "@/graphql/users";
import { Action, Getter } from "vuex-class";

@Component({
  name: "profile-menu"
})
export default class ProfileMenu extends Vue {
  @Action("users/logOut") logOut;
  @Getter("users/loggedUser") loggedUser;

  async onLogout() {
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

  mounted() {
    const self = this;
  }

  __getAvatar(url) {
    return process.env.VUE_APP_SOCKETIO_URI + "/upload/avatars/" + url;
  }
}
</script>

<style scoped>
.transition {
  transition: all 0.3s ease-in;
}
</style>

<style lang="scss" module>
@import "./style.module.scss";
</style>
