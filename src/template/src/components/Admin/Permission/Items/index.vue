<template>
  <div>
    <Can I="listPermission">
      <div class="row mb-4">
        <div class="col-lg-6">
          <s-input :searchIn="searchInInfo" />
          <a-button
            class="ml-4"
            type="dashed"
            icon="reload"
            @click.prevent="__init"
            style="margin: 0 auto"
            >Refresh</a-button
          >
        </div>
        <div class="col-lg-6 text-right">
          <pagination
            routePath="admin/permission"
            :options="pagination"
            :total="total"
          />
        </div>
      </div>
      <a-table
        class="box-white"
        :dataSource="items"
        :columns="columns"
        :pagination="false"
        size="small"
        :rowKey="record => record.node.id"
        @change="onChange"
        :loading="loading"
      >
        <a slot="_id" slot-scope="value" class="utils__link--underlined">
          {{ value }}
        </a>
        <span slot="_actions" slot-scope="record">
          <Can I="updatePermission">
            <a-button
              type="link"
              icon="edit"
              size="small"
              class="mr-2"
              @click="$bus.$emit('permissions.edit.show', record.node.id)"
              >Edit</a-button
            >
          </Can>
          <Can I="deletePermission">
            <d-button
              size="small"
              type="link"
              store="permissions"
              :id="record.node.id"
            ></d-button>
          </Can>
        </span>
      </a-table>
      <div class="row mt-4">
        <div class="col-lg-12 text-right">
          <pagination
            routePath="admin/permission"
            :options="pagination"
            :total="total"
          />
        </div>
      </div>
    </Can>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { getVariables, createUrl, initQs } from "@/helper/utils";
import Pagination from "@/components/LayoutComponents/Pagination/index.vue";
import { State, Action } from "vuex-class";

@Component({
  name: "permission-items",
  components: {
    Pagination
  }
})
export default class PermissionItems extends Vue {
  @Watch("$store.state.rules") permissionChange() {
    this.__init();
  }
  @Watch("$route") _routeChange() {
    this.__init();
  }
  @Action("permissions/fetchAll") fetchAll;
  @Action("permissions/count") count;
  @State(state => state.permissions.items) items;
  @State(state => state.permissions.total) total;

  //loading state
  loading: boolean = false;

  //filter
  sortedInfo: any = null;
  filteredInfo: any = null;
  searchInInfo: any = [
    { name: "Name", field: "name" },
    { name: "Description", field: "description" }
  ];

  //pagination
  pagination: any = {
    size: "small",
    current: 1,
    pageSize: 30
  };

  //table properties
  get columns() {
    let { sortedInfo, filteredInfo } = this;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};

    const columns: any = [
      {
        title: "#",
        dataIndex: "node.id",
        key: "id", // sort with field in model
        sorter: true,
        sortOrder: sortedInfo.columnKey === "id" && sortedInfo.order,
        scopedSlots: { customRender: "_id" }
      },
      {
        title: "Tên (Query/Mutation)",
        dataIndex: "node.name",
        key: "name", // sort with field in model
        sorter: true,
        sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
        scopedSlots: { customRender: "_name" }
      },
      {
        title: "Mô tả",
        dataIndex: "node.description",
        scopedSlots: { customRender: "_description" }
      },
      {
        align: "right",
        scopedSlots: { customRender: "_actions" }
      }
    ];

    return columns;
  }

  //table pagination event
  onChange(pagination, filters, sorter) {
    this.filteredInfo = filters;
    this.sortedInfo = sorter;

    this.$router.push(`?
      ${createUrl(this.sortedInfo, this.filteredInfo)}
    `);
  }

  beforeMount() {
    this.__init();
  }

  created() {
    this.$bus.$on("permissions.refresh", () => {
      this.__init();
    });
  }

  async __init() {
    this.loading = true;
    //if not total, get total to calculate page
    if (this.total === 0) {
      await this.count();
    }

    const { page } = this.$route.query;
    const currentPage: any = typeof page !== "undefined" ? page : 1;
    const variables: any = getVariables(this, currentPage);
    const { currentSort, currentFilters } = initQs();
    this.sortedInfo = currentSort;
    this.filteredInfo = currentFilters;

    try {
      await this.fetchAll(variables);

      this.loading = false;
      this.$bus.$emit("bc.total", this.total);
    } catch (error) {
      this.loading = false;
    }
  }
}
</script>
