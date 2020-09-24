<template>
  <a-modal
    centered
    :maskClosable="false"
    destroyOnClose
    v-model="visible"
    onOk="onSubmit"
  >
    <div slot="title">Change password</div>
    <div class="row">
      <div class="col-lg-12">
        <a-form class="mt-3" :form="form" @submit="onSubmit">
          <div class="row">
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
          </div>
        </a-form>
      </div>
    </div>
    <template slot="footer">
      <a-button key="back" @click="visible = false">Cancel</a-button>
      <a-button
        key="submit"
        type="primary"
        icon="save"
        :loading="loading"
        @click="onSubmit"
        >Lưu</a-button
      >
    </template>
  </a-modal>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Action } from "vuex-class";

@Component({
  name: "change-password-modal"
})
export default class ChangePasswordModal extends Vue {
  @Action("users/changePassword") changePassword;

  loading: boolean = false;
  visible: boolean = false;
  form: any = {};
  confirmDirty: boolean = false;

  onSubmit(e) {
    e.preventDefault();

    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.loading = true;

        try {
          await this.changePassword({
            password: values.password
          });

          this.$notification.success({
            message: "Mật khẩu",
            description: "Đổi mật khẩu thành công"
          });

          this.form.resetFields();
          this.loading = false;
          this.visible = false;
        } catch (error) {
          this.loading = false;
          this.visible = false;
        }
      }
    });
  }

  beforeMount() {
    this.form = this.$form.createForm(this);
  }

  created() {
    this.$bus.$on("users.changepassword.show", async () => {
      this.visible = true;
    });
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
