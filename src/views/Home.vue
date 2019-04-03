<template>
  <div class="home">
    <QRCodeReader v-if="scanning" @scanned="showDetails" />
    <OrderDetail v-if="!scanning" :root="root"  />
  </div>
</template>

<script>
// @ is an alias to /src
import QRCodeReader from '@/components/QRCodeReader.vue'
import OrderDetail from '@/components/OrderDetail.vue'

export default {
  name: 'home',
  components: {
    QRCodeReader, 
    OrderDetail
  },
  data() {
    return {
      scanning: true,
      root: ''
    }
  },
  methods: {
    showDetails(root) {
      console.log("scanned root:", root)
      this.scanning = false
      this.root = root
    }
  }
}
</script>
