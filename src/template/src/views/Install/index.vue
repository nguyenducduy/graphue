<template>
  <div :class="[$style.install_container, 'd-flex justify-content-center']">
    <div :class="$style.block">
      <div class="row">
        <div class="col-xl-12">
          <div :class="$style.inner">
            <h3 class="text-5xl mb-3">Installation</h3>
            <div :class="$style.form">
              <a-form class="login-form" :form="form" @submit="onSubmit">
                <a-form-item label="Admin email">
                  <a-input
                    placeholder="Email"
                    v-decorator="[
                      'email',
                      {
                        rules: [
                          {
                            required: true,
                            message: 'Please input your email!'
                          }
                        ]
                      }
                    ]"
                  >
                    <a-icon
                      slot="prefix"
                      type="mail"
                      style="color: rgba(0,0,0,.25);"
                    />
                  </a-input>
                </a-form-item>
                <a-form-item label="Admin fullname">
                  <a-input
                    placeholder="Fullname"
                    v-decorator="[
                      'fullName',
                      {
                        rules: [
                          {
                            required: true,
                            message: 'Please input your fullname!'
                          }
                        ]
                      }
                    ]"
                  >
                    <a-icon
                      slot="prefix"
                      type="idcard"
                      style="color: rgba(0,0,0,.25);"
                    />
                  </a-input>
                </a-form-item>
                <a-form-item label="Admin password" has-feedback>
                  <a-input
                    placeholder="Password"
                    type="password"
                    v-decorator="[
                      'password',
                      {
                        rules: [
                          {
                            required: true,
                            message: 'Please input your password!'
                          },
                          {
                            validator: validateToNextPassword
                          }
                        ]
                      }
                    ]"
                  >
                    <a-icon
                      slot="prefix"
                      type="lock"
                      style="color: rgba(0,0,0,.25);"
                    />
                  </a-input>
                </a-form-item>
                <a-form-item label="Repeat password" has-feedback>
                  <a-input
                    type="password"
                    @blur="handleConfirmPasswordBlur"
                    v-decorator="[
                      'confirm',
                      {
                        rules: [
                          {
                            required: true,
                            message: 'Please input your repeat password'
                          },
                          {
                            validator: compareToFirstPassword
                          }
                        ]
                      }
                    ]"
                  >
                    <a-icon
                      slot="prefix"
                      type="lock"
                      style="color: rgba(0,0,0,.25);"
                    />
                  </a-input>
                </a-form-item>
                <div class="form-actions">
                  <a-button type="primary" htmlType="submit" :loading="loading"
                    >Install</a-button
                  >
                </div>
              </a-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  name: "install-page"
})
export default class InstallPage extends Vue {
  form: any = {};
  loading: boolean = false;
  confirmDirty: boolean = false;

  created() {
    this.form = this.$form.createForm(this);
  }

  onSubmit(e) {
    e.preventDefault();
    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.loading = true;

        try {
          const res = await this.$http.post("/install", {
            email: values.email,
            fullName: values.fullName,
            password: values.password
          });

          if (res && res.data.installed) {
            this.$router.push("/admin/login");
            this.$notification.success({
              message: "Installation successfull",
              description:
                "Your account has been created, use it to login to system",
              placement: "bottomLeft"
            });
          }

          this.loading = false;
        } catch (err) {
          this.loading = false;

          this.$notification.error({
            message: "Install failed.",
            description: err.toString(),
            placement: "bottomLeft"
          });
        }
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
      callback("Two password not match");
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

<style lang="scss" module>
@import "./style.module.scss";
</style>
