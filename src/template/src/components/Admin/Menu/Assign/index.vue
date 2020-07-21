<template>
  <div>
    <Can I="assignMenuGroup">
      <a-drawer
        v-if="group"
        :title="`Gán menu cho nhóm #${group.id} ${group.screenName}`"
        placement="right"
        :visible="visible"
        width="25%"
        :closable="false"
        @close="visible = false"
      >
        <div class="row">
          <div class="col-lg-12 mb-10">
            <a-tree
              :showIcon="false"
              checkable
              :checkStrictly="true"
              :autoExpandParent="true"
              v-model="checkedKeys"
              :treeData="menuItems"
              :replaceFields="replaceFields"
              :expandedKeys.sync="expandedKeys"
              @check="onCheck"
            ></a-tree>
          </div>
        </div>
        <div class="drawer-footer">
          <a-button class="mr-2" @click="visible = false">Cancel</a-button>
          <a-button
            class="mr-2"
            icon="save"
            type="primary"
            @click="onSubmit"
            :loading="loading"
          >Save</a-button>
        </div>
      </a-drawer>
    </Can>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { Action, State } from "vuex-class";

@Component({
  name: "assign-menu-drawer"
})
export default class AssignMenu extends Vue {
  @Action("menus/fetchAll") fetchAllMenu;
  @Action("groups/fetchOne") fetchGroup;
  @Action("groups/assignMenu") assignMenu;
  @State(state => state.menus.items) menuItems;
  @State(state => state.groups.item) group;
  // @Watch("checkedKeys")
  // onCheckedKeysChange(keys) {
  //   this.checkedKeys = keys.checked;
  // }

  visible: boolean = false;
  form: any = {};
  loading: boolean = false;

  groupId: number = 0;
  expandedKeys: any = [];
  checkedKeys: any = [];
  replaceFields: any = {
    children: "children",
    title: "name",
    key: "id"
  };

  onCheck(keys, context) {
    this.checkedKeys = keys.checked;
  }

  async onSubmit(e) {
    e.preventDefault();

    try {
      this.loading = true;
      await this.assignMenu({
        id: this.group.id,
        menus: this.checkedKeys
      });

      // update group state
      await this.fetchGroup(this.group.id);
      this.$notification.success({
        message: "Assign menu",
        description: `Assign menu cho nhóm "${this.group.screenName}" thành công`
      });

      this.loading = false;
    } catch (error) {
      this.loading = false;
    }
  }

  created() {
    this.$bus.$on("menus.assign.show", async groupId => {
      this.loading = true;
      this.checkedKeys = [];
      this.groupId = groupId;

      // get all permissions
      await this.fetchAllMenu({
        first: 1000,
        last: 1000
      });
      let ids = [];
      JSON.stringify(this.menuItems, (key, value) => {
        if (key === "parentId") {
          if (value !== null) {
            ids.push(value.toString());
          }
        }
        return value;
      });

      this.expandedKeys = [...new Set(ids)];

      // get info of selected group
      await this.fetchGroup(groupId);

      // map selected permission
      let idsChecked = [];
      this.group.menus.map(menu => {
        // exclude checked Root, because it will enable all nodes in tree
        if (menu.name !== "Root") {
          idsChecked.push(menu.id);
        }
      });
      this.checkedKeys = [...new Set(idsChecked)];

      this.loading = false;
      this.visible = true;
    });
  }
}
</script>
