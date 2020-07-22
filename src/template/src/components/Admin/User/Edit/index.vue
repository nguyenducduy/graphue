<template>
  <div>
    <Can I="updateUser">
      <a-drawer
        :title="`Sửa thành viên #${id}`"
        placement="right"
        :visible="visible"
        width="35%"
        @close="visible = false"
      >
        <div class="row">
          <div class="col-lg-12">
            <a-form class="mt-3" :form="form" @submit="onSubmit">
              <div class="row">
                <div class="col-lg-6">
                  <a-form-item label="Họ và tên">
                    <a-input
                      v-decorator="[
                        'fullName',
                        {
                          rules: [
                            {
                              required: true,
                              message: 'Vui lòng điền họ và tên'
                            }
                          ]
                        }
                      ]"
                    />
                  </a-form-item>
                </div>
                <div class="col-lg-6">
                  <a-form-item label="Email">
                    <a-input
                      disabled
                      v-decorator="[
                        'email',
                        {
                          rules: [
                            {
                              type: 'email',
                              message: 'Email không hợp lệ'
                            },
                            {
                              required: true,
                              message: 'Vui lòng điền email'
                            }
                          ]
                        }
                      ]"
                    />
                  </a-form-item>
                </div>
                <div class="col-lg-6">
                  <a-form-item label="Nhóm">
                    <a-select
                      v-decorator="[
                        'groupId',
                        {
                          rules: [
                            {
                              required: true,
                              message: 'Vui lòng chọn nhóm'
                            }
                          ]
                        }
                      ]"
                      placeholder="Chọn nhóm"
                    >
                      <a-select-option
                        v-for="group in groupItems"
                        :value="group.node.id"
                        :key="group.node.id"
                      >
                        {{ group.node.screenName }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </div>
                <div class="col-lg-6">
                  <a-form-item label="Status">
                    <a-select
                      v-decorator="[
                        'status',
                        {
                          rules: [
                            {
                              required: true,
                              message: 'Vui lòng chọn status'
                            }
                          ]
                        }
                      ]"
                      placeholder="Chọn status"
                    >
                      <a-select-option
                        v-for="status in statusItems"
                        :value="status.value"
                        :key="status.value"
                      >
                        {{ status.text }}
                      </a-select-option>
                    </a-select>
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
import { Vue, Component } from "vue-property-decorator";
import { Action, State } from "vuex-class";
import { hasErrors } from "@/helper/utils";

@Component({
  name: "user-edit-drawer"
})
export default class UserEdit extends Vue {
  @Action("users/fetchOne") fetchOneUser;
  @Action("users/update") update;
  @Action("groups/fetchAll") fetchAllGroup;
  @Action("users/fetchAllStatus") fetchAllStatus;
  @State(state => state.users.item) item;
  @State(state => state.groups.items) groupItems;
  @State(state => state.users.statusItems) statusItems;

  visible: boolean = false;
  form: any = {};
  loading: boolean = false;
  hasErrors: any = hasErrors;
  id: number = 0;

  onSubmit(e) {
    e.preventDefault();
    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.loading = true;

        try {
          await this.update({
            id: this.id,
            fullName: values.fullName,
            groupId: +values.groupId,
            status: +values.status
          });

          this.$notification.success({
            message: "Thành viên",
            description: `Cập nhật thành viên "${values.fullName}" thành công`
          });

          this.form.resetFields();
          this.loading = false;
          this.visible = false;
        } catch (error) {
          this.loading = false;
        }
      }
    });
  }

  async beforeMount() {
    this.form = this.$form.createForm(this);

    await this.fetchAllGroup({
      first: 1000,
      last: 1000
    });

    await this.fetchAllStatus();
  }

  created() {
    this.$bus.$on("users.edit.show", async id => {
      this.id = id;

      await this.fetchOneUser(this.id);

      this.form = this.$form.createForm(this, {
        mapPropsToFields: () => {
          return {
            fullName: this.$form.createFormField({
              value: this.item.fullName
            }),
            email: this.$form.createFormField({
              value: this.item.email
            }),
            groupId: this.$form.createFormField({
              value: this.item.group.id
            }),
            status: this.$form.createFormField({
              value: this.item.status.value
            })
          };
        }
      });

      this.visible = true;
    });
  }
}
</script>
