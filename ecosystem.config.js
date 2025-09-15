module.exports = {
  apps: [
    {
      name: "nuxt-app",
      script: "npm",
      args: "run start",
      env: {
        PORT: 4000,
        HOST: "0.0.0.0"
      }
    }
  ]
}