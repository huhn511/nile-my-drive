<template>
  <div v-loading="loading">
    <h1>Order Detail</h1>

    <el-form ref="form" label-position="top">
      <el-form-item label="ID">
        <el-input v-model="order.data.id" readonly></el-input>
      </el-form-item>
      <el-form-item label="Status">
        <el-input v-model="order.status" readonly></el-input>
      </el-form-item>
      <el-form-item label="Shipping location">
        <el-input v-model="order.data.shipping_location" readonly></el-input>
        <p>
          view on
          <a
            :href="'https://www.google.com/maps/search/?api=1&query=' + location.latitude + ',' + location.longitude"
          >google maps</a>
        </p>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Commit pick up</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetch } from "@/utils/MAM";
const iotaAreaCodes = require("@iota/area-codes");

export default {
  name: 'OrderDetail',
  props: ["root"],
  data() {
    return {
      loading: false,
      messages: [],
      order: {
        data: {
          id: 0
        }
      },
      location: {}
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData: async function() {
      this.loading = true;
      try {
        await fetch(
          this.root,
          "restriced",
          "TEST",
          this.appendToMessages,
          this.fetchComplete
        );
      } catch (err) {
        // handle error
      }
      this.loading = false;
    },
    appendToMessages(message) {
      this.messages.push(message);
    },
    fetchComplete() {
      this.order = this.sortedMessages[0];
      let iac = this.order.data.shipping_location;
      this.location = iotaAreaCodes.decode(iac);
    },
    onSubmit() {
      console.log("submit!");
    }
  },
  computed: {
    sortedMessages: function() {
      function compare(a, b) {
        if (a.timestamp > b.timestamp) return -1;
        if (a.timestamp < b.timestamp) return 1;
        return 0;
      }
      return this.messages.sort(compare);
    }
  }
};
</script>

<style>
</style>

