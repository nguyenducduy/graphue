<template>
  <div>
    <Can I="createGroup">
      <a-button type="primary" icon="plus" @click="visible = true">Thêm</a-button>
      <a-drawer
        title="Thêm nhóm"
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
                      placeholder="ex: admin"
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
                      placeholder="ex: Administrator"
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
                    <a-input placeholder="ex: #fafafa, or blue/red" v-decorator="['color']" />
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
import { Action } from "vuex-class";

@Component({
  name: "group-add-drawer"
})
export default class GroupAdd extends Vue {
  @Action("groups/create") create;

  visible: boolean = false;
  form: any = {};
  loading: boolean = false;

  onSubmit(e) {
    e.preventDefault();
    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.loading = true;

        try {
          await this.create({
            name: values.name,
            screenName: values.screenName,
            color: values.color
          });

          this.$notification.success({
            message: "Nhóm thành viên",
            description: `Thêm nhóm "${values.screenName}" thành công`
          });

          this.form.resetFields();
          this.loading = false;
          this.$bus.$emit("groups.refresh");
        } catch (error) {
          this.loading = false;
        }
      }
    });
  }

  created() {
    this.form = this.$form.createForm(this);
  }
}
</script>
