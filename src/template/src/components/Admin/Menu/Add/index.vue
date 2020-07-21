<template>
  <div>
    <Can I="createMenu">
      <a-drawer
        placement="right"
        :visible="visible"
        width="100%"
        @close="onClose"
        :get-container="false"
        :wrap-style="{ position: 'absolute' }"
      >
        <template slot="title">
          <a-icon type="plus" class="mr-2" /> Add child menu of menu <strong>{{ parentTitle }}</strong>
        </template>
        <div class="row">
          <div class="col-lg-12">
            <a-form class="mt-3" :form="form" @submit="onSubmit">
              <div class="row">
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
          <a-button class="mr-2" @click="onClose">Cancel</a-button>
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
  name: 'add-menu-drawer',
})
export default class MenuAdd extends Vue {
  @Action('menus/create') create

  visible: boolean = false
  form: any = {}
  loading: boolean = false
  hasErrors: any = hasErrors

  parentId: number = 0
  parentTitle: number = 0

  onClose() {
    this.visible = false
    this.form.resetFields()
  }

  onSubmit(e) {
    e.preventDefault()

    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.loading = true

        try {
          await this.create({
            name: values.name,
            path: values.path,
            icon: values.icon,
            parentId: +this.parentId,
          })

          this.$notification.success({
            message: 'Menu',
            description: `Add "${values.name}" successfully`,
            placement: 'bottomRight',
          })

          this.form.resetFields()
          this.loading = false
          this.visible = false
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
    this.$bus.$on('menus.create.show', async (parentId, parentTitle) => {
      this.parentId = parentId
      this.parentTitle = parentTitle
      this.visible = true
      this.form.validateFields()
    })

    this.$bus.$on('menus.create.close', () => {
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
