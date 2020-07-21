<template>
  <a-popconfirm :title="_Title" okText="Yes" cancelText="Cancel" placement="left" @confirm="onDelete">
    <a-tooltip :mouseLeaveDelay="0" title="Delete">
      <a-button
        :loading="loading"
        icon="delete"
        :type="type"
        :size="size"
        class="focus:outline-none focus:shadow-outline text-red-500 hover:text-red-600"
        >{{ btnText }}</a-button
      >
    </a-tooltip>
  </a-popconfirm>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'd-button',
})
export default class DeleteButton extends Vue {
  @Prop() id: number
  @Prop() store: string
  @Prop() size: string
  @Prop() type: string
  @Prop() title: string
  @Prop() btnText: string
  @Prop() closeComponent: string
  @Prop() notificationAlign: string

  get _Title() {
    if (typeof this.title === 'undefined' || this.title === '') {
      return 'Are you sure?'
    } else {
      return this.title
    }
  }

  loading: boolean = false

  async onDelete() {
    this.loading = true

    try {
      await this.$store.dispatch(`${this.store}/deleteOne`, this.id)

      this.$notification.success({
        message: 'Delete',
        description: `Xoá ${this.store} #${this.id} thành công`,
        placement: this.notificationAlign !== '' ? this.notificationAlign : '',
      })

      this.loading = false
      this.$bus.$emit(`${this.store}.refresh`)

      if (this.closeComponent !== '') {
        this.$bus.$emit(`${this.store}.${this.closeComponent}.close`)
      }
    } catch (error) {
      this.loading = false
    }
  }
}
</script>
