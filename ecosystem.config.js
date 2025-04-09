module.exports = {
  apps: [
    {
      name: 'my-clustered-app', // Name of your application
      script: 'server.js', // The main entry point (server.js for your app)
      instances: 'max', // Use all available CPU cores for clustering
      exec_mode: 'cluster', // Cluster mode for load balancing
      watch: true, // Watch for file changes (optional)
      env: {
        NODE_ENV: 'development', // Development environment variables
        PORT: 8000,
      },
      env_production: {
        NODE_ENV: 'production', // Production environment variables
        PORT: 8000,
      },
      error_file: './logs/err.log', // Error log path
      out_file: './logs/out.log', // Standard output log path
      log_file: './logs/combined.log', // Combined log file path
      time: true, // Add timestamps to logs
    },
  ],
};
