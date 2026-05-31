/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const routes = ['demo', 'methodology', 'tools', 'research', 'participate', 'about'];
    const list = [
      {
        source: '/',
        destination: '/index.html',
      },
    ];
    routes.forEach(route => {
      list.push({
        source: `/${route}`,
        destination: `/${route}/index.html`,
      });
      list.push({
        source: `/${route}/`,
        destination: `/${route}/index.html`,
      });
    });
    return list;
  },
}

export default nextConfig

