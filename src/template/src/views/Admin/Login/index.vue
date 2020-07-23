<template>
  <div :class="[$style.login_container, 'd-flex justify-content-center']">
    <div :class="$style.block">
      <div class="row">
        <div class="col-xl-12">
          <div :class="$style.inner">
            <h3 class="text-5xl mb-3">
              SignIn
              <span class="text-3xl mb-3">to Graphue</span>
            </h3>
            <div :class="$style.form">
              <a-form class="login-form" :form="form" @submit="onSubmit">
                <a-form-item label="Email">
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
                    <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25);" />
                  </a-input>
                </a-form-item>
                <a-form-item label="Password">
                  <a-input
                    placeholder="Password"
                    type="password"
                    v-decorator="[
                      'password',
                      {
                        rules: [
                          {
                            required: true,
                            message: 'Please input your Password!'
                          }
                        ]
                      }
                    ]"
                  >
                    <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25);" />
                  </a-input>
                </a-form-item>
                <div class="text-right">
                  <a-button type="link">Forgot password?</a-button>
                </div>
                <div class="form-actions">
                  <a-button
                    type="primary"
                    htmlType="submit"
                    class="login-form-button width-150"
                    :loading="loading"
                  >Sign in</a-button>
                  <a-button
                    class="float-right"
                    type="dashed"
                    icon="google"
                    :loading="loading"
                    @click.prevent="onGoogleSignin('google')"
                  >Sign in with Google</a-button>
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
import { Mutation, Getter, Action } from "vuex-class";

@Component({
  name: "admin-login-page"
})
export default class AdminLogin extends Vue {
  @Action("users/loginByEmail") loginByEmail;
  @Getter("users/isAuth") isAuth;
  @Mutation("SET_ALL_MENU") setAllMenu;

  form: any = {};
  loading: boolean = false;

  created() {
    if (this.isAuth) {
      this.$router.push("/admin");
    }
    this.form = this.$form.createForm(this);
  }

  async onGoogleSignin(provider) {
    try {
      await this.$auth.authenticate(provider);
    } catch (error) {
      location.reload();
    }
  }

  onSubmit(e) {
    e.preventDefault();
    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.loading = true;

        try {
          // set Logged-User, Access-Token, Access-Menu
          const response = await this.loginByEmail({
            email: values.email,
            password: values.password
          });

          // set All-Menu
          this.setAllMenu(response.data.loginUser.user.menu);

          // set Access-Permission
          Vue.ls.set(
            "Access-Permission",
            response.data.loginUser.user.group.permissions
          );

          const redirectUrl: any =
            this.$route.query.redirect || "/admin/overview";
          return (window.location.href = `
              ${window.location.protocol}//${window.location.hostname +
            (window.location.port
              ? ":" + window.location.port
              : "")}${redirectUrl}
            `);
        } catch (err) {
          this.loading = false;
        }
      }
    });
  }
}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
