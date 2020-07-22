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
import Pagination from "@/components/LayoutComponents/Pagination/index.vue";
import Breadcrumbs from "@/components/LayoutComponents/Breadcrumbs/index.vue";
import PermissionItems from "@/components/Admin/Permission/Items/index.vue";
import PermissionAddDrawer from "@/components/Admin/Permission/Add/index.vue";
import PermissionEditDrawer from "@/components/Admin/Permission/Edit/index.vue";

@Component({
  name: "permission-page",
  components: {
    Pagination,
    Breadcrumbs,
    PermissionItems,
    PermissionAddDrawer,
    PermissionEditDrawer
  }
})
export default class PermissionPage extends Vue {
  bc: any = [
    {
      title: "Thành viên",
      url: "/admin/user",
      active: false
    },
    {
      title: "Permission",
      url: "",
      active: false
    },
    {
      title: "List",
      url: "",
      active: true
    }
  ];
}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
