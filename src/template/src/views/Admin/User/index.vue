<template>
  <div :class="$style.content">
    <div class="row">
      <div class="col-lg-6">
        <breadcrumbs :data="bc" />
      </div>
      <div class="col-lg-6 text-right">
        <user-add-drawer />
      </div>
    </div>
    <user-items />
    <user-edit-drawer />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Pagination from "@/components/LayoutComponents/Pagination/index.vue";
import Breadcrumbs from "@/components/LayoutComponents/Breadcrumbs/index.vue";
import UserItems from "@/components/Admin/User/Items/index.vue";
import UserAddDrawer from "@/components/Admin/User/Add/index.vue";
import UserEditDrawer from "@/components/Admin/User/Edit/index.vue";

@Component({
  name: "user-page",
  components: {
    Pagination,
    Breadcrumbs,
    UserItems,
    UserAddDrawer,
    UserEditDrawer
  }
})
export default class UserPage extends Vue {
  bc: any = [
    {
      title: "Thành viên",
      url: "/admin/user",
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
