/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.tibiawiki.com.br',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.noctera-global.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'noctera-global.com',
        port: '',
        pathname: '/**',
      },
    ],
	unoptimized: false,
  },
  experimental: {
		serverActions: {
			allowedForwardedHosts: ['localhost', 'noctera-global.com'],
			allowedOrigins: ['http://localhost', 'noctera-global.com', 'http://noctera-global.com', 'https://www.noctera-global.com']
		},
	},
  async headers() {
    return [
      {
        // matching all API routes
        // https://vercel.com/guides/how-to-enable-cors
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://noctera-global.com" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
