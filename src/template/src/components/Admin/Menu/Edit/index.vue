<template>
  <div>
    <Can I="updateMenu">
      <a-drawer
        placement="right"
        :visible="visible"
        width="100%"
        @close="visible = false"
        :getContainer="false"
        :wrapStyle="{ position: 'absolute', overflow: 'auto' }"
      >
        <template slot="title">
          <a-icon type="edit" class="mr-2" /> Edit menu <strong>{{ title }}</strong>
        </template>
        <div class="row">
          <div class="col-lg-12 mb-10">
            <a-form class="mt-3" :form="form" @submit="onSubmit">
              <div class="row">
                <div class="col-lg-12">
                  <a-form-item label="Parent ID">
                    <a-tree-select
                      v-decorator="[
                        'parentId',
                        {
                          rules: [
                            {
                              required: true,
                              message: 'Vui lòng chọn danh mục cha',
                            },
                          ],
                        },
                      ]"
                      placeholder="Chọn danh mục cha"
                      style="width: 100%"
                      :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                      treeDefaultExpandAll
                      :replaceFields="replaceFields"
                      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                      :tree-data="items"
                      tree-default-expand-all
                    ></a-tree-select>
                  </a-form-item>
                </div>
                <div class="col-lg-12">
                  <a-form-item label="Name">
                    <a-input
                      v-decorator="[
                        'name',
                        {
                          rules: [
                            {
                              required: true,
                              message: 'Please input name',
                            },
                          ],
                        },
                      ]"
                    />
                  </a-form-item>
                </div>
                <div class="col-lg-12">
                  <a-form-item label="Path">
                    <a-input v-decorator="['path']" />
                  </a-form-item>
                </div>
                <div class="col-lg-12">
                  <a-form-item label="Icon">
                    <a-input v-decorator="['icon']" />
                  </a-form-item>
                </div>
              </div>
            </a-form>
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
            :disabled="hasErrors(form.getFieldsError())"
            >Save</a-button
          >
        </div>
      </a-drawer>
    </Can>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'
import { hasErrors } from '@/helper/utils'

@Component({
  name: 'edit-menu-drawer',
})
export default class MenuEdit extends Vue {
  @Action('menus/fetchOne') fetchOne
  @Action('menus/fetchAll') fetchAll
  @Action('menus/update') update
  @State((state) => state.menus.items) items
  @State((state) => state.menus.item) item

  visible: boolean = false
  form: any = {}
  loading: boolean = false
  hasErrors: any = hasErrors

  id: number = 0
  title: string = ''
  replaceFields: any = {
    children: 'children',
    title: 'name',
    key: 'id',
    value: 'id',
  }

  onSubmit(e) {
    e.preventDefault()

    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.loading = true

        try {
          await this.update({
            id: this.id,
            name: values.name,
            path: values.path,
            icon: values.icon,
            parentId: +values.parentId,
          })

          this.$notification.success({
            message: 'Menu',
            description: `Update "${values.name}" successfully`,
            placement: 'bottomRight',
          })

          // this.form.resetFields()
          this.loading = false
          // this.visible = false
          this.$bus.$emit('menus.refresh')
        } catch (error) {
          this.loading = false
        }
      }
    })
  }

  beforeMount() {
    this.form = this.$form.createForm(this)
  }

  created() {
    this.$bus.$on('menus.edit.show', async (id, title) => {
      this.id = id
      this.title = title

      await this.fetchOne(this.id)
      await this.fetchAll()

      this.form = this.$form.createForm(this, {
        mapPropsToFields: () => {
          return {
            name: this.$form.createFormField({
              value: this.item.name,
            }),
            path: this.$form.createFormField({
              value: this.item.path,
            }),
            icon: this.$form.createFormField({
              value: this.item.icon,
            }),
            parentId: this.$form.createFormField({
              value: this.item.parentId,
            }),
          }
        },
      })

      this.visible = true
    })

    this.$bus.$on('menus.edit.close', () => {
      this.visible = false
    })
  }

  mounted() {
    this.$nextTick(() => {
      // To disabled submit button at the beginning.
      this.form.validateFields()
    })
  }
}
</script>
