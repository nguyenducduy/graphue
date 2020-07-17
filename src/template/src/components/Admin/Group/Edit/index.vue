<template>
  <div>
    <Can I="updateGroup">
      <a-drawer
        :title="`Sửa nhóm #${id}`"
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
                  <a-form-item label="Tên (giá trị)">
                    <a-input
                      v-decorator="[
                        'name',
                        {
                          rules: [
                            {
                              required: true,
                              message: 'Vui lòng điền tên (giá trị)!'
                            }
                          ]
                        }
                      ]"
                    />
                  </a-form-item>
                </div>
                <div class="col-lg-12">
                  <a-form-item label="Tên (hiển thị)">
                    <a-input
                      v-decorator="[
                        'screenName',
                        {
                          rules: [
                            {
                              required: true,
                              message: 'Vui lòng điền tên (hiển thị)!'
                            }
                          ]
                        }
                      ]"
                    />
                  </a-form-item>
                </div>
                <div class="col-lg-12">
                  <a-form-item label="Màu thể hiện (hex, rgb, plain)">
                    <a-input
                      v-decorator="[
                        'color',
                        {
                          rules: [
                            {
                              required: true,
                              message: 'Vui lòng điền màu thể hiện!'
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
  name: "group-edit-drawer"
})
export default class GroupEdit extends Vue {
  @Action("groups/fetchOne") fetchOne;
  @Action("groups/update") update;
  @State(state => state.groups.item) item;

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
            screenName: values.screenName,
            color: values.color
          });

          this.$notification.success({
            message: "Cập nhật nhóm thành công!",
            description: values.screenName
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
    this.$bus.$on("groups.edit.show", async id => {
      this.id = id;
      await this.fetchOne(this.id);

      this.form = this.$form.createForm(this, {
        mapPropsToFields: () => {
          return {
            name: this.$form.createFormField({
              value: this.item.name
            }),
            screenName: this.$form.createFormField({
              value: this.item.screenName
            }),
            color: this.$form.createFormField({
              value: this.item.color
            })
          };
        }
      });

      this.visible = true;
    });
  }
}
</script>
