module.exports = {
    apps: [
        {
            name: 'my-app',            // App name in PM2
            script: 'app.js',          // Entry point file for the app
            instances: 'max',          // Number of instances to run (based on CPU cores)
            exec_mode: 'cluster',      // Use clustering mode for scaling
            watch: true,               // Watch for file changes (useful for development)
            env: {                     // Development environment variables
                NODE_ENV: 'development',
                PORT: 3000,
            },
            env_production: {          // Production environment variables
                NODE_ENV: 'production',
                PORT: 8080,
            },
            log_date_format: 'YYYY-MM-DD HH:mm Z',  // Log timestamp format
            error_file: './logs/app-error.log',     // Error log file
            out_file: './logs/app-out.log',         // Output log file
            merge_logs: true,           // Merge logs from all instances
            max_memory_restart: '500M', // Restart app if memory usage exceeds 500MB
        },
    ],
    deploy: {                    // Deployment configuration (optional)
        production: {
            user: 'username',
            host: 'your-server-ip',
            ref: 'origin/master',
            repo: 'git@github.com:your-repo.git',
            path: '/var/www/your-app',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
        },
    },
};
