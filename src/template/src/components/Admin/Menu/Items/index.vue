<template>
  <div>
    <Can I="listMenu">
      <div class="row">
        <div class="col-lg-3">
          <a-alert message="Help" type="info" show-icon>
            <template slot="description">
              - Click on
              <strong>Category name</strong> to modify selected category.
              <br />- Right on <strong>Category name</strong> to
              <strong class="text-primary">
                <a-icon type="plus" />Add new Category
              </strong>
              inside selected category or
              <strong class="text-danger">
                <a-icon type="delete" />Delete selected category </strong
              >.
            </template>
          </a-alert>
        </div>
        <div class="col-lg-3">
          <a-tree
            v-contextmenu:contextMenuContainer
            class="box-white mt-2"
            :blockNode="true"
            :treeData="items"
            :replaceFields="replaceFields"
            :selectedKeys.sync="selectedKeys"
            :showIcon="false"
            :expandedKeys.sync="expandedKeys"
            @select="onSelect"
            @rightClick="onContext"
          ></a-tree>
          <v-contextmenu ref="contextMenuContainer">
            <Can I="createMenu">
              <v-contextmenu-item @click="onAddSelect()">
                <a-icon type="plus" class="mr-2" />
                <span>Add child</span>
              </v-contextmenu-item>
            </Can>
            <Can I="deleteMenu">
              <v-contextmenu-item divider></v-contextmenu-item>
              <v-contextmenu-item :auto-hide="false">
                <d-button
                  size="small"
                  type="link"
                  store="menus"
                  :id="selectedId"
                  btnText="Delete"
                  closeComponent="edit"
                  notificationAlign="bottomRight"
                ></d-button>
              </v-contextmenu-item>
            </Can>
          </v-contextmenu>
        </div>
        <div class="col-lg-3 ml-2">
          <div class="drawer-container">
            <menu-add-drawer />
            <menu-edit-drawer />
          </div>
        </div>
      </div>
    </Can>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { State, Action } from "vuex-class";
import MenuAddDrawer from "@/components/Admin/Menu/Add/index.vue";
import MenuEditDrawer from "@/components/Admin/Menu/Edit/index.vue";

@Component({
  name: "menu-items",
  components: {
    MenuAddDrawer,
    MenuEditDrawer
  }
})
export default class MenuItems extends Vue {
  @Watch("$store.state.rules") permissionChange() {
    this.__init();
  }
  @Watch("$route") _routeChange() {
    this.__init();
  }
  @Action("menus/fetchAll") fetchAll;
  @Action("menus/deleteOne") deleteOne;
  @State(state => state.menus.items) items;

  //loading state
  loading: boolean = false;

  //tree
  selectedKeys: any = [];
  replaceFields: any = {
    children: "children",
    title: "name",
    key: "id"
  };
  expandedKeys: any = [];

  //context menu
  selectedId: number = 0;
  selectedTitle: string = "";

  async onSelect(keys, context) {
    if ((this.$can as any)("updateMenu")) {
      this.$bus.$emit("menus.create.close");
      this.$bus.$emit("menus.edit.close");
      this.$bus.$emit(
        "menus.edit.show",
        context.node.eventKey,
        context.node.title
      );
    } else {
      this.$notification.error({
        message: "Menu",
        description: "Not permission to edit menu"
      });
    }
  }

  onAddSelect() {
    this.$bus.$emit("menus.create.close");
    this.$bus.$emit("menus.edit.close");
    this.$bus.$emit("menus.create.show", this.selectedId, this.selectedTitle);
  }

  onContext(context) {
    this.selectedKeys = [];
    this.selectedKeys.push(context.node.eventKey);
    this.selectedId = context.node.eventKey;
    this.selectedTitle = context.node.title;
  }

  beforeMount() {
    this.__init();
  }

  created() {
    this.$bus.$on("menus.refresh", () => {
      this.__init();
    });
  }

  async __init() {
    this.loading = true;

    try {
      await this.fetchAll();

      let ids = [];
      JSON.stringify(this.items, (key, value) => {
        if (key === "parentId") {
          if (value !== null) {
            ids.push(value.toString());
          }
        }
        return value;
      });

      this.expandedKeys = [...new Set(ids)];

      this.loading = false;
    } catch (error) {
      this.loading = false;
    }
  }
}
</script>
