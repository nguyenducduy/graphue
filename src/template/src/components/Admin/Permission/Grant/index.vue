<template>
  <div>
    <Can I="grantPermissionGroup">
      <a-drawer
        v-if="group"
        :title="`Gán quyền cho nhóm #${group.id} ${group.screenName}`"
        placement="right"
        :visible="visible"
        width="50%"
        :closable="false"
        @close="visible = false"
      >
        <div class="row">
          <div class="col-lg-12">
            <a-input-search placeholder="Search by query/mutation or description" @search="onSearch" class="mb-2" />

            <a-table
              class="mb-5"
              :pagination="{
                pageSize: 1000,
                hideOnSinglePage: true,
              }"
              :rowSelection="{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange,
              }"
              :dataSource="permissionItems"
              :columns="columns"
              size="small"
              :rowKey="(record) => record.node.id"
              :loading="loading"
            ></a-table>
          </div>
        </div>
        <div class="drawer-footer">
          <a-button class="mr-2" @click="visible = false">Cancel</a-button>
          <a-button class="mr-2" icon="save" type="primary" @click="onSubmit" :loading="loading">Save</a-button>
        </div>
      </a-drawer>
    </Can>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'

@Component({
  name: 'permission-grant-drawer',
})
export default class PermissionGrant extends Vue {
  @Action('permissions/fetchAll') fetchAllPermission
  @Action('groups/fetchOne') fetchGroup
  @Action('groups/grantPermission') grantPermission
  @State((state) => state.permissions.items) permissionItems
  @State((state) => state.groups.item) group

  visible: boolean = false
  form: any = {}
  loading: boolean = false

  selectedRowKeys: any = []
  groupId: number = 0

  get columns() {
    const columns: any = [
      {
        title: '#',
        dataIndex: 'node.id',
        scopedSlots: { customRender: '_id' },
      },
      {
        title: 'Tên (Query/Mutation)',
        dataIndex: 'node.name',
        scopedSlots: { customRender: '_name' },
      },
      {
        title: 'Mô tả',
        dataIndex: 'node.description',
        scopedSlots: { customRender: '_description' },
      },
    ]

    return columns
  }

  get hasSelected() {
    return this.selectedRowKeys.length > 0
  }

  onSelectChange(selectedRowKeys) {
    this.selectedRowKeys = selectedRowKeys
  }

  onSearch(value) {
    console.log(value)
  }

  async onSubmit(e) {
    e.preventDefault()

    try {
      this.loading = true

      await this.grantPermission({
        id: this.group.id,
        permissions: this.selectedRowKeys,
      })

      //update group state
      await this.fetchGroup(this.group.id)

      this.$notification.success({
        message: 'Gán quyền',
        description: `Gán quyền cho nhóm "${this.group.screenName}" thành công`,
      })

      this.loading = false
    } catch (error) {
      this.loading = false
    }
  }

  created() {
    this.$bus.$on('permissions.grant.show', async (groupId) => {
      this.loading = true
      this.selectedRowKeys = []
      this.groupId = groupId

      // get all permissions
      await this.fetchAllPermission({
        first: 1000,
        last: 1000,
      })

      // get info of selected group
      await this.fetchGroup(groupId)

      // map selected permission
      this.group.permissions.map((perm) => {
        this.selectedRowKeys.push(perm.id)
      })

      this.loading = false
      this.visible = true
    })
  }
}
</script>
