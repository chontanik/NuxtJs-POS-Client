module.exports = {
  apps: [
    {
      name: "POS_NUXTJS_CLIENT",
      script: "npm",
      args: "run start",
      env: {
        PORT: 4000,
        HOST: "0.0.0.0"
      }
    }
  ]
}