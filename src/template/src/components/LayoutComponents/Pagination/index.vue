<template>
  <a-pagination
    :size="options.size"
    :total="total"
    :current="options.current"
    :pageSize="options.pageSize"
    :showQuickJumper="options.showQuickJumper"
    hideOnSinglePage
    @change="onPageChange"
  />
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
const qs = require("query-string");

@Component({
  name: "pagination"
})
export default class Pagination extends Vue {
  @Prop() routePath;
  @Prop() options;
  @Prop() total;

  @Watch("$route")
  _routeChange() {
    const { page } = this.$route.query;
    const currentPage: any = typeof page !== "undefined" ? page : 1;
    this.options.current = parseInt(currentPage);
  }

  onPageChange(pageNumber) {
    let currentQs = qs.parse(window.location.search, { arrayFormat: "comma" });
    currentQs.page = pageNumber;

    this.$router.push(
      `/${this.routePath}?${qs.stringify(currentQs, { arrayFormat: "comma" })}`
    );

    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }

  created() {
    const { page } = this.$route.query;
    const currentPage: any = typeof page !== "undefined" ? page : 1;
    this.options.current = parseInt(currentPage);
  }
}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
