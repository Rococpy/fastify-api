module.exports = {
  apps: [
    {
      name: 'Fastify-API:1025',
      script: 'yarn',
      args: 'start',
      version: '0.1.0',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
