<template>
  <div :class="$style.content">
    <div class="row">
      <Can I="listUser">
        <div class="col-lg-6">
          <breadcrumbs :data="bc" />
        </div>
        <div class="col-lg-6 text-right">
          <user-add-drawer />
        </div>
      </Can>
    </div>
    <user-items />
    <user-edit-drawer />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Breadcrumbs from "@/components/Layout/Breadcrumbs/index.vue";
import UserItems from "@/components/Admin/User/Items/index.vue";
import UserAddDrawer from "@/components/Admin/User/Add/index.vue";
import UserEditDrawer from "@/components/Admin/User/Edit/index.vue";

@Component({
  name: "user-page",
  components: {
    Breadcrumbs,
    UserItems,
    UserAddDrawer,
    UserEditDrawer
  }
})
export default class UserPage extends Vue {
  bc: any = [
    {
      title: "menu.User",
      url: "/admin/user",
      active: false
    },
    {
      title: "menu.List",
      url: "",
      active: true
    }
  ];
}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
