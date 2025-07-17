module.exports = {
  apps: [
    {
      name: "gamenewversion.bxok.online 3009",
      script: "bun run start -p 3009",
      watch: ".",
    },
    {
      script: "./serv˝ice-worker/",
      watch: ["./service-worker"],
    },
  ],

  deploy: {
    production: {
      user: "SSH_USERNAME",
      host: "SSH_HOSTMACHINE",
      ref: "origin/master",
      repo: "GIT_REPOSITORY",
      path: "DESTINATION_PATH",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
