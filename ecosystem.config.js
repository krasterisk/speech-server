module.exports = {
    apps: [
        {
            name: "vosk_server_api",
            script: "./dist/main.js",
            watch: false,
            env: {
                NODE_ENV: "production",
            },
            env_production: {
                NODE_ENV: "production",
            },
        }
    ]
};
