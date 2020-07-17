<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Socket } from "vue-socket.io-extended";

@Component({
  name: "app-page"
})
export default class App extends Vue {
  @Socket()
  connect() {
    console.log("Socket connected...");
  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
