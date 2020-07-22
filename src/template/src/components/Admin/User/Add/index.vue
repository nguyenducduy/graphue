<template>
  <div>
    <Can I="createUser">
      <a-button type="primary" icon="plus" @click="visible = true"
        >Thêm</a-button
      >
      <a-drawer
        title="Thêm thành viên"
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
                  <a-form-item label="Mật khẩu" has-feedback>
                    <a-input
                      type="password"
                      v-decorator="[
                        'password',
                        {
                          rules: [
                            {
                              required: true,
                              message: 'Vui lòng điền mật khẩu'
                            },
                            {
                              validator: __validateToNextPassword
                            }
                          ]
                        }
                      ]"
                    />
                  </a-form-item>
                </div>
                <div class="col-lg-6">
                  <a-form-item label="Nhập lại mật khẩu" has-feedback>
                    <a-input
                      type="password"
                      @blur="__handleConfirmPasswordBlur"
                      v-decorator="[
                        'confirm',
                        {
                          rules: [
                            {
                              required: true,
                              message: 'Vui lòng điền nhập lại mật khẩu'
                            },
                            {
                              validator: __compareToFirstPassword
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
  name: "user-add-drawer"
})
export default class UserAdd extends Vue {
  @Action("users/create") create;
  @Action("groups/fetchAll") fetchAllGroup;
  @Action("users/fetchAllStatus") fetchAllStatus;
  @State(state => state.groups.items) groupItems;
  @State(state => state.users.statusItems) statusItems;

  visible: boolean = false;
  form: any = {};
  loading: boolean = false;
  hasErrors: any = hasErrors;
  confirmDirty: boolean = false;
  groupList: any = [];

  onSubmit(e) {
    e.preventDefault();

    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.loading = true;

        try {
          await this.create({
            fullName: values.fullName,
            email: values.email,
            password: values.password,
            groupId: +values.groupId,
            status: +values.status
          });

          this.$notification.success({
            message: "Thành viên",
            description: `Thêm "${values.fullName}" thành công`
          });

          this.form.resetFields();
          this.loading = false;
          this.visible = false;
          this.$bus.$emit("users.refresh");
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

  __handleConfirmPasswordBlur(e) {
    const value = e.target.value;
    this.confirmDirty = this.confirmDirty || !!value;
  }

  __compareToFirstPassword(rule, value, callback) {
    const form = this.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("2 mật khẩu không trùng nhau");
    } else {
      callback();
    }
  }

  __validateToNextPassword(rule, value, callback) {
    const form = this.form;
    if (value && this.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  }
}
</script>
