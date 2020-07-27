<template>
  <div :class="$style.content">
    <div class="row">
      <Can I="listGroup">
        <div class="col-lg-6">
          <breadcrumbs :data="bc" />
        </div>
        <div class="col-lg-6 text-right">
          <group-add-drawer />
        </div>
      </Can>
    </div>
    <group-items />
    <group-edit-drawer />
    <permission-grant-drawer />
    <assign-menu-drawer />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Pagination from "@/components/Layout/Pagination/index.vue";
import Breadcrumbs from "@/components/Layout/Breadcrumbs/index.vue";
import GroupItems from "@/components/Admin/Group/Items/index.vue";
import GroupAddDrawer from "@/components/Admin/Group/Add/index.vue";
import GroupEditDrawer from "@/components/Admin/Group/Edit/index.vue";
import PermissionGrantDrawer from "@/components/Admin/Permission/Grant/index.vue";
import AssignMenuDrawer from "@/components/Admin/Menu/Assign/index.vue";

@Component({
  name: "group-page",
  components: {
    Pagination,
    Breadcrumbs,
    GroupItems,
    GroupAddDrawer,
    GroupEditDrawer,
    PermissionGrantDrawer,
    AssignMenuDrawer
  }
})
export default class GroupPage extends Vue {
  bc: any = [
    {
      title: "menu.User",
      url: "/admin/user",
      active: false
    },
    {
      title: "menu.Group",
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
