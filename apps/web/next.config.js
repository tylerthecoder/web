/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['i.scdn.co', 'files.tylertracy.com'],
  },
  experimental: {
    appDir: true,
  },
  output: "standalone"
}
