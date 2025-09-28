const webpack = require("webpack");
const path = require("path");

const isExport = process.env.BUILD_TARGET === 'export'

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    outputFileTracingRoot: path.resolve(__dirname),
  },
  // Note: outputFileTracingRoot is not supported in Next 14; removed
  output: isExport ? 'export' : 'standalone',
  // Removed: trailingSlash: true,

  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer, dev }) => {
    // Fix for webpack module resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve('buffer'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util'),
      process: require.resolve('process/browser'),
    };
    
    if (!isServer) {
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      );
    }

    // Optimize chunk loading for both dev and production
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: -30,
            reuseExistingChunk: true,
          },
        },
      },
      runtimeChunk: 'single',
    }

    // Keep default React resolution; avoid overriding jsx-runtime mapping
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    return config;
  },
};

module.exports = nextConfig;


