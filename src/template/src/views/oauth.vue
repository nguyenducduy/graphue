<template>
  <a-result
    status="success"
    :title="`Verified by ${$route.params.provider.toUpperCase()}`"
    sub-title="If you dont want to create your password, we will create random passphase for you."
  >
    <template #extra>
      <a-avatar :size="64" :src="picture" />

      <a-form class="mt-3" :form="form" @submit="onSubmit">
        <div class="row">
          <div class="col-lg-12">
            <a-form-item label="Họ và tên">
              <a-input
                disabled
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
          <div class="col-lg-12">
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
          <div class="col-lg-12">
            <a-form-item label="Mật khẩu" has-feedback>
              <a-input
                type="password"
                v-decorator="[
                  'password',
                  {
                    rules: [
                      {
                        validator: validateToNextPassword
                      }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </div>
          <div class="col-lg-12">
            <a-form-item label="Nhập lại mật khẩu" has-feedback>
              <a-input
                type="password"
                @blur="handleConfirmPasswordBlur"
                v-decorator="[
                  'confirm',
                  {
                    rules: [
                      {
                        validator: compareToFirstPassword
                      }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </div>
        </div>
      </a-form>
      <a-button icon="double-right" type="primary" @click="onSubmit" :loading="loading">Enter site</a-button>
    </template>
  </a-result>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Action, Mutation } from "vuex-class";
const qs = require("query-string");

@Component({
  name: "oauth-page"
})
export default class Oauth extends Vue {
  @Action("users/loginByGoogle") loginByGoogle;
  @Mutation("SET_ALL_MENU") setAllMenu;

  form: any = {};
  loading: boolean = false;
  confirmDirty: boolean = false;
  picture: string = "";
  userInfo: any = null;

  onSubmit(e) {
    e.preventDefault();

    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.loading = true;

        try {
          // set Logged-User, Access-Token, Access-Menu
          const response = await this.loginByGoogle({
            fullName: values.fullName,
            email: values.email,
            password: values.password,
            picture: this.userInfo["picture"],
            token: this.userInfo["access_token"],
            refreshToken: this.userInfo["refresh_token"],
            expiresAt: this.userInfo["expires_at"]
          });

          // set All-Menu
          this.setAllMenu(response.data.createFromGoogleUser.user.menu);

          // set Access-Permission
          Vue.ls.set(
            "Access-Permission",
            response.data.createFromGoogleUser.user.group.permissions
          );

          this.form.resetFields();
          window.close();
        } catch (error) {
          this.loading = false;

          this.$notification.error({
            message: "Error login using Google.",
            description: error.toString(),
            placement: "bottomLeft"
          });
        }
      }
    });
  }

  created() {
    this.userInfo = qs.parse(window.location.search);

    this.picture = this.userInfo["picture"];
    this.form = this.$form.createForm(this, {
      mapPropsToFields: () => {
        return {
          fullName: this.$form.createFormField({
            value: this.userInfo["name"]
          }),
          email: this.$form.createFormField({
            value: this.userInfo["email"]
          })
        };
      }
    });
  }

  handleConfirmPasswordBlur(e) {
    const value = e.target.value;
    this.confirmDirty = this.confirmDirty || !!value;
  }

  compareToFirstPassword(rule, value, callback) {
    const form = this.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("2 mật khẩu không trùng nhau");
    } else {
      callback();
    }
  }

  validateToNextPassword(rule, value, callback) {
    const form = this.form;
    if (value && this.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  }
}
</script>
