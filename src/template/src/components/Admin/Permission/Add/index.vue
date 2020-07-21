<template>
  <div>
    <Can I="createPermission">
      <a-button type="primary" icon="plus" @click="visible = true">Thêm</a-button>
      <a-drawer title="Thêm quyền" placement="right" :visible="visible" width="25%" @close="visible = false">
        <div class="row">
          <div class="col-lg-12">
            <a-form class="mt-3" :form="form" @submit="onSubmit">
              <div class="row">
                <div class="col-lg-12">
                  <a-form-item label="Tên (Query/Mutation)">
                    <a-input
                      placeholder="ex: userList, createUser"
                      v-decorator="[
                        'name',
                        {
                          rules: [
                            {
                              required: true,
                              message: 'Vui lòng điền tên!',
                            },
                          ],
                        },
                      ]"
                    />
                  </a-form-item>
                </div>
                <div class="col-lg-12">
                  <a-form-item label="Mô tả">
                    <a-textarea
                      :auto-size="{ minRows: 2, maxRows: 6 }"
                      v-decorator="[
                        'description',
                        {
                          rules: [
                            {
                              required: true,
                              message: 'Vui lòng điền mô tả!',
                            },
                          ],
                        },
                      ]"
                    />
                  </a-form-item>
                </div>
              </div>
            </a-form>
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
import { Action } from 'vuex-class'

@Component({
  name: 'permission-add-drawer',
})
export default class PermissionAdd extends Vue {
  @Action('permissions/create') create

  visible: boolean = false
  form: any = {}
  loading: boolean = false

  onSubmit(e) {
    e.preventDefault()

    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.loading = true

        try {
          await this.create({
            name: values.name,
            description: values.description,
          })

          this.$notification.success({
            message: 'Quyền',
            description: `Thêm quyền "${values.name}" thành công.`,
          })

          this.form.resetFields()
          this.loading = false
          this.$bus.$emit('permissions.refresh')
        } catch (error) {
          this.loading = false
        }
      }
    })
  }

  created() {
    this.form = this.$form.createForm(this)
  }
}
</script>
