<template>
  <div>
    <Can I="listUser">
      <div class="row mb-4">
        <div class="col-lg-6">
          <s-input :searchIn="searchInInfo" />
          <a-button
            class="ml-4"
            type="dashed"
            icon="reload"
            @click.prevent="__init"
            style="margin: 0 auto"
          >Refresh</a-button>
        </div>
        <div class="col-lg-6 text-right">
          <pagination routePath="admin/user" :options="pagination" :total="total" />
        </div>
      </div>
      <a-table
        size="small"
        class="box-white"
        :dataSource="items"
        :columns="columns"
        :pagination="false"
        :rowKey="record => record.node.id"
        :loading="loading"
        @change="onChange"
      >
        <a slot="_id" slot-scope="value" class="utils__link--underlined">
          {{
          value
          }}
        </a>
        <template slot="_avatar" slot-scope="record">
          <a-avatar
            v-if="record.node.avatar !== null"
            size="small"
            icon="user"
            :src="__getAvatar(record.node.avatar)"
          />
          <a-avatar
            v-else
            size="small"
            :style="`backgroundColor: ${record.node.status.color}`"
          >{{ record.node.fullName[0] }}</a-avatar>
        </template>
        <template slot="_name" slot-scope="value">{{ value }}</template>
        <a-tag
          slot="_status"
          slot-scope="record"
          :color="record.node.status.color"
        >{{ record.node.status.text }}</a-tag>
        <a-tag
          slot="_group"
          slot-scope="record"
          :color="record.node.group.color"
        >{{ record.node.group.screenName }}</a-tag>
        <span slot="_actions" slot-scope="record">
          <Can I="updateUser">
            <a-button
              type="link"
              icon="edit"
              size="small"
              class="mr-2"
              @click="$bus.$emit('users.edit.show', record.node.id)"
            >Edit</a-button>
          </Can>
          <Can I="deleteUser">
            <d-button size="small" type="link" store="users" :id="record.node.id"></d-button>
          </Can>
        </span>
      </a-table>
      <div class="row mt-4">
        <div class="col-lg-12 text-right">
          <pagination routePath="admin/user" :options="pagination" :total="total" />
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
  name: "user-items",
  components: {
    Pagination
  }
})
export default class UserItems extends Vue {
  @Watch("$store.state.rules") permissionChange() {
    this.__init();
  }
  @Watch("$route") _routeChange() {
    this.__init();
  }
  @Action("users/fetchAll") fetchAll;
  @Action("users/count") count;
  @Action("groups/fetchAll") fetchAllGroup;
  @State(state => state.users.items) items;
  @State(state => state.users.total) total;
  @State(state => state.users.statusItems) statusItems;
  @State(state => state.groups.items) groupItems;

  //loading state
  loading: boolean = false;

  //filter
  sortedInfo: any = null;
  filteredInfo: any = null;
  searchInInfo: any = [
    { name: "Fullname", field: "full_name" },
    { name: "Email", field: "email" }
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
        scopedSlots: { customRender: "_avatar" }
      },
      {
        title: "Họ và tên",
        dataIndex: "node.fullName",
        key: "full_name",
        sorter: true,
        sortOrder: sortedInfo.columnKey === "full_name" && sortedInfo.order,
        scopedSlots: { customRender: "_name" }
      },
      {
        title: "Email",
        dataIndex: "node.email",
        key: "email",
        sorter: true,
        sortOrder: sortedInfo.columnKey === "email" && sortedInfo.order,
        scopedSlots: { customRender: "_email" }
      },
      {
        title: "Oauth Provider",
        dataIndex: "node.oauthProvider",
        key: "oauth_provider", // sort with field in model
        sorter: true,
        sortOrder:
          sortedInfo.columnKey === "oauth_provider" && sortedInfo.order,
        scopedSlots: { customRender: "_oauthProvider" }
      },
      {
        title: "Status",
        scopedSlots: { customRender: "_status" },
        key: "status",
        sorter: true,
        sortOrder: sortedInfo.columnKey === "status" && sortedInfo.order,
        filteredValue: filteredInfo.status || null,
        filters: this.statusItems
      },
      {
        title: "Group",
        scopedSlots: { customRender: "_group" },
        width: "10%",
        key: "group_id", // sort with field in model
        sorter: true,
        sortOrder: sortedInfo.columnKey === "group_id" && sortedInfo.order,
        filteredValue: filteredInfo.group_id || null,
        filters: this.groupItems.map(group => ({
          text: group.node.screenName,
          value: group.node.id
        }))
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
    this.$bus.$on("users.refresh", () => {
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

  __getAvatar(url) {
    return process.env.VUE_APP_SOCKETIO_URI + "/upload/avatars/" + url;
  }
}
</script>
