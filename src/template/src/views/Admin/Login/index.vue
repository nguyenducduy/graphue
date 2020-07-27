<template>
  <div :class="[$style.login_container, 'd-flex justify-content-center']">
    <div :class="$style.block">
      <div class="row">
        <div class="col-lg-12">
          <div :class="$style.inner">
            <h3 class="text-5xl mb-3">
              {{ $t("views.login.SignIn") }}
            </h3>
            <div :class="$style.form">
              <a-form class="login-form" :form="form" @submit="onSubmit">
                <a-form-item :label="$t('views.login.Email')">
                  <a-input
                    :placeholder="$t('views.login.Email')"
                    v-decorator="[
                      'email',
                      {
                        rules: [
                          {
                            required: true,
                            message: this.$t('views.login.EmailIsRequired')
                          }
                        ]
                      }
                    ]"
                  >
                    <a-icon
                      slot="prefix"
                      type="user"
                      style="color: rgba(0,0,0,.25);"
                    />
                  </a-input>
                </a-form-item>
                <a-form-item :label="$t('views.login.Password')">
                  <a-input
                    :placeholder="$t('views.login.Password')"
                    type="password"
                    v-decorator="[
                      'password',
                      {
                        rules: [
                          {
                            required: true,
                            message: this.$t('views.login.PasswordIsRequired')
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
                <div class="text-right">
                  <a-button type="link">{{
                    $t("views.login.ForgotPassword")
                  }}</a-button>
                </div>
                <div class="form-actions">
                  <a-button
                    type="primary"
                    htmlType="submit"
                    class="login-form-button width-150"
                    :loading="loading"
                    >{{ $t("views.login.SignIn") }}</a-button
                  >
                  <a-button
                    class="float-right"
                    type="dashed"
                    icon="google"
                    :loading="loading"
                    @click.prevent="onGoogleSignin('google')"
                    >{{ $t("views.login.SignInWithGoogle") }}</a-button
                  >
                </div>
              </a-form>
            </div>
          </div>
        </div>
        <div class="col-lg-12 mt-8">
          <language-selector style="width: 100px; margin: 0 auto" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Mutation, Getter, Action } from "vuex-class";
import LanguageSelector from "@/components/Layout/Topbar/LanguageSelector/index.vue";

@Component({
  name: "admin-login-page",
  components: {
    LanguageSelector
  }
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
