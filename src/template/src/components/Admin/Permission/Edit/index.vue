<template>
  <div>
    <Can I="updatePermission">
      <a-drawer
        :title="`Sửa quyền #${id}`"
        placement="right"
        :visible="visible"
        width="25%"
        @close="visible = false"
      >
        <div class="row">
          <div class="col-lg-12">
            <a-form class="mt-3" :form="form" @submit="onSubmit">
              <div class="row">
                <div class="col-lg-12">
                  <a-form-item label="Tên (Query/Mutation)">
                    <a-input
                      v-decorator="[
                        'name',
                        {
                          rules: [
                            {
                              required: true,
                              message: 'Vui lòng điền tên!'
                            }
                          ]
                        }
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
                              message: 'Vui lòng điền mô tả!'
                            }
                          ]
                        }
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
import { Vue, Component } from "vue-property-decorator";
import { Action, State } from "vuex-class";

@Component({
  name: "permission-edit-drawer"
})
export default class PermissionEdit extends Vue {
  @Action("permissions/fetchOne") fetchOne;
  @Action("permissions/update") update;
  @State(state => state.permissions.item) item;

  visible: boolean = false;
  form: any = {};
  loading: boolean = false;
  id: number = 0;

  onSubmit(e) {
    e.preventDefault();
    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.loading = true;

        try {
          await this.update({
            id: this.id,
            name: values.name,
            description: values.description
          });

          this.$notification.success({
            message: "Quyền",
            description: `Cập nhật quyền "${values.name}" thành công`,
            placement: "bottomLeft"
          });
          this.form.resetFields();
          this.visible = false;
          this.loading = false;
        } catch (error) {
          this.loading = false;
        }
      }
    });
  }

  created() {
    this.$bus.$on("permissions.edit.show", async id => {
      this.id = id;
      await this.fetchOne(this.id);

      this.form = this.$form.createForm(this, {
        mapPropsToFields: () => {
          return {
            name: this.$form.createFormField({
              value: this.item.name
            }),
            description: this.$form.createFormField({
              value: this.item.description
            })
          };
        }
      });

      this.visible = true;
    });
  }
}
</script>
