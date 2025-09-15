module.exports = {
  apps: [
    {
      name: "POS_NUXTJS_CLIENT",
      script: ".output/server/index.mjs",
      interpreter: "node",
      env: {
        PORT: 4000,
        HOST: "0.0.0.0"
      }
    }
  ]
}