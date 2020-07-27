<template>
  <div :class="$style.breadcrumbs">
    <div :class="$style.path">
      <a-button
        class="mr-2 text-2xl"
        type="link"
        @click="$router.go(-1)"
        icon="arrow-left"
      ></a-button>
      <template v-for="(item, index) in data">
        <span :key="index" class="text-2xl">
          <span class="font-weight-normal" v-if="item.active">
            {{ item.title }}
            <span v-if="total > 0 && item.active">({{ total }})</span>
          </span>
          <strong v-else>
            <router-link :to="item.url">{{ item.title }}</router-link>
          </strong>
          <span v-if="!item.active" :class="$style.arrow"></span>
        </span>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component({
  name: "breadcrumbs"
})
export default class Breadcrumbs extends Vue {
  @Prop() data;
  total: number = 0;

  mounted() {
    this.$bus.$on("bc.total", val => {
      this.total = val;
    });
  }
}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
