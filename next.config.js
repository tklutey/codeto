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
  }
});

module.exports = nextConfig;
