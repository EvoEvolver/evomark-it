import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from "vite-plugin-pages";

const path = require("path")

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Vue(),Pages(
    {
      pagesDir: path.resolve(__dirname,"src/.evomark_ir/")
    }
  ),],
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: []
    },
    port: process.env.evomark_dev_port || 5000
  },
  publicDir: path.resolve(__dirname,"src/.evomark_ir/assets"),
  root: __dirname,
})