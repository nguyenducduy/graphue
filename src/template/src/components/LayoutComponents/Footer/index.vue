<template>
  <div :class="$style.footer">
    <div :class="$style.inner">
      <div class="row">
        <div class="col-sm-12">
          <div :class="$style.copyright">
            <img src="/images/logo.png" rel="noopener noreferrer" />
            <span class="pr-4">
              © 2019
              <a
                href="http://mksoftware.co/"
                target="_blank"
                rel="noopener noreferrer"
                >Graphue</a
              >
              <br />All rights reserved
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  name: "vu-footer"
})
export default class VuFooter extends Vue {}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
