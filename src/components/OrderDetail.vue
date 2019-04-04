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
import { fetch, generateSeed } from "@/utils/MAM";
const iotaAreaCodes = require("@iota/area-codes");

import { provider } from '@/config.json';
import { composeAPI } from '@iota/core'
const Converter = require('@iota/converter')


const iota = composeAPI({
    provider: provider
})

export default {
  name: "OrderDetail",
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
      this.loading = true;
      console.log("pick up packed!");
      // Must be truly random & 81-trytes long.
      const seed = generateSeed();
      let request_object = {
        name: "my drive application"
      };
      const message = Converter.asciiToTrytes(JSON.stringify(request_object));
      // Array of transfers which defines transfer recipients and value transferred in IOTAs.
      const transfers = [
        {
          address: this.order.data.pickup_address,
          value: 0, // 1Ki
          tag: "", // optional tag of `0-27` trytes
          message: message // optional message in trytes
        }
      ];
      console.log("transfers", transfers);
      // Depth or how far to go for tip selection entry point.
      const depth = 3;
      // Difficulty of Proof-of-Work required to attach transaction to tangle.
      // Minimum value on mainnet is `14`, `7` on spamnet and `9` on devnet and other testnets.
      const minWeightMagnitude = 14;
      // Prepare a bundle and signs it.
      iota
        .prepareTransfers(seed, transfers)
        .then(trytes => {
          // Persist trytes locally before sending to network.
          // This allows for reattachments and prevents key reuse if trytes can't
          // be recovered by querying the network after broadcasting.
          // Does tip selection, attaches to tangle by doing PoW and broadcasts.
          return iota.sendTrytes(trytes, depth, minWeightMagnitude);
        })
        .then(bundle => {
          console.log(
            `Published transaction with tail hash: ${bundle[0].hash}`
          );
          console.log(`Bundle: ${bundle}`);
          this.loading = false;
        })
        .catch(err => {
          // handle errors here
          this.loading = false;
        });
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

