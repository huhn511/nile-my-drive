<template>
  <div>
    <h1>Order Detail</h1>
    {{root}}
    <pre>{{order}}</pre>
  </div>
</template>

<script>
import { fetch } from "@/utils/MAM";

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

