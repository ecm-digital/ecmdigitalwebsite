/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  output: 'export',
  images: {
    unoptimized: true
  },
  async redirects() {
    return [
      {
        source: '/:path*.html/',
        destination: '/:path*.html',
        permanent: true,
      },
      {
        source: '/:segment*/',
        has: [{ type: 'header', key: 'accept', value: 'text/html' }],
        destination: '/:segment*/index.html',
        permanent: false,
      },
    ]
  },
  webpack: (config, { isServer }) => {
    config.externals = config.externals || [];
    config.externals.push({
      '@aws-sdk/client-cognito-identity-provider': 'commonjs @aws-sdk/client-cognito-identity-provider',
      '@aws-sdk/client-dynamodb': 'commonjs @aws-sdk/client-dynamodb',
      '@aws-sdk/client-rds': 'commonjs @aws-sdk/client-rds'
    });
    
    // Ignoruj błędy w folderze agency-management-panel
    config.resolve.alias = {
      ...config.resolve.alias,
      '@agency-management-panel': false
    };
    
    return config;
  }
}

module.exports = nextConfig
