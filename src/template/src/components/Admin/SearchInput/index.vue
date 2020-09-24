<template>
  <a-input-search
    :placeholder="
      `Find in ${searchIn
        .map(o => {
          return o.name;
        })
        .join(', ')}`
    "
    style="width: 320px"
    @search="onSearch"
    :loading="loading"
    v-model="text"
    allow-clear
  />
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { createUrl, initQs } from "@/helper/utils";

@Component({
  name: "s-input"
})
export default class SearchInput extends Vue {
  @Prop() searchIn: any;
  text: string = "";
  loading: boolean = false;

  onSearch(value) {
    this.text = value;
    const { currentSort, currentFilters } = initQs();
    const searchedInfo = {
      text: this.text,
      in: this.searchIn
    };

    this.$router.push(`?
      ${createUrl(currentSort, currentFilters, searchedInfo)}
    `);
  }

  mounted() {
    const { currentSearchText } = initQs();
    this.text = currentSearchText;
  }
}
</script>
