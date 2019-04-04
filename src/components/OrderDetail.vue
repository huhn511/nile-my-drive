<template>
  <div v-loading="loading">
    <h1>Order Detail</h1>
    {{root}}
    <p>{{order.data.shipping_location}}</p>
    <p>view on <a :href="'https://www.google.com/maps/search/?api=1&query=' + location.latitude + ',' + location.longitude">google maps</a></p>
    <pre >{{order}}</pre>
  </div>
</template>

<script>
import { fetch } from "@/utils/MAM";
const iotaAreaCodes = require('@iota/area-codes');

export default {
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
      console.log("load data from root: ", this.root);
      try {
          await fetch(
            this.root,
            "restriced",
            "TEST",
            this.appendToMessages,
            this.fetchComplete
          );
        } catch (err) {
          console.log("error", err)
        }
      this.loading = false;
    },
    appendToMessages(message) {
      console.log("message", message);
      this.messages.push(message);
    },
    fetchComplete() { 
      this.order = this.sortedMessages[0];
      let iac = this.order.data.shipping_location
      console.log("iac", iac);
      console.log("vaild?", iotaAreaCodes.isValid(iac));
      this.location = iotaAreaCodes.decode(iac)
      console.log("this.location", this.location)
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

