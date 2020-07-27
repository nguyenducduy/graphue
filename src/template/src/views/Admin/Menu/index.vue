<template>
  <div :class="$style.content">
    <div class="row">
      <Can I="listMenu">
        <div class="col-lg-6">
          <breadcrumbs :data="bc" />
        </div>
      </Can>
    </div>
    <menu-items />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Pagination from '@/components/Layout/Pagination/index.vue'
import Breadcrumbs from '@/components/Layout/Breadcrumbs/index.vue'
import MenuItems from '@/components/Admin/Menu/Items/index.vue'

@Component({
  name: 'user-page',
  components: {
    Pagination,
    Breadcrumbs,
    MenuItems,
  },
})
export default class MenuPage extends Vue {
  bc: any = [
    {
      title: this.$t('menu.Menu'),
      url: '/admin/menu',
      active: false,
    },
    {
      title: this.$t('menu.List'),
      url: '',
      active: true,
    },
  ]
}
</script>

<style lang="scss" module>
@import './style.module.scss';
</style>
