<template>
  <div :class="$style.content">
    <div class="row">
      <Can I="listPermission">
        <div class="col-lg-6">
          <breadcrumbs :data="bc" />
        </div>
        <div class="col-lg-6 text-right">
          <permission-add-drawer />
        </div>
      </Can>
    </div>
    <permission-items />
    <permission-edit-drawer />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Breadcrumbs from "@/components/Layout/Breadcrumbs/index.vue";
import PermissionItems from "@/components/Admin/Permission/Items/index.vue";
import PermissionAddDrawer from "@/components/Admin/Permission/Add/index.vue";
import PermissionEditDrawer from "@/components/Admin/Permission/Edit/index.vue";

@Component({
  name: "permission-page",
  components: {
    Breadcrumbs,
    PermissionItems,
    PermissionAddDrawer,
    PermissionEditDrawer
  }
})
export default class PermissionPage extends Vue {
  bc: any = [
    {
      title: "menu.User",
      url: "/admin/user",
      active: false
    },
    {
      title: "menu.Permission",
      url: "",
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
