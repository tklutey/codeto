/** @type {import('next').NextConfig} */

const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@babel/preset-react',
  '@fullcalendar/common',
  '@fullcalendar/daygrid',
  '@fullcalendar/interaction',
  '@fullcalendar/react',
  '@fullcalendar/timegrid',
  '@fullcalendar/list',
  '@fullcalendar/timeline'
]);

const nextConfig = withTM({
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/student/dashboard',
        permanent: true
      }
    ];
  },
  env: {
    SUPABASE_URL: 'https://albpgbarsvqtxqeodwvi.supabase.co',
    SUPABASE_KEY:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsYnBnYmFyc3ZxdHhxZW9kd3ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjMxOTk2MDIsImV4cCI6MTk3ODc3NTYwMn0.gkrByuOz1k_ydoPAxKxfpH3sHnN-JFg5Y8X8oB83QZ8'
  }
});

module.exports = nextConfig;
