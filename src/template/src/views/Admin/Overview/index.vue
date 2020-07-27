<template>
  <div :class="$style.content">
    <div class="row">
      <div class="col-lg-12">
        <breadcrumbs :data="bc" />
      </div>
      <div class="col-lg-12">Documentation at http://abc.xyz</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Breadcrumbs from "@/components/Layout/Breadcrumbs/index.vue";

@Component({
  name: "admin-overview-page",
  components: {
    Breadcrumbs
  }
})
export default class OverviewPage extends Vue {
  bc: any = [
    {
      title: "Overview",
      url: "",
      active: true
    }
  ];
}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
