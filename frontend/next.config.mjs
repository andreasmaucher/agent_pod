/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      config.module.rules.push({
        test: /\.map$/,
        loader: 'ignore-loader'
      },
      {
        test: /\.d\.ts$/,
        loader: 'ignore-loader'
      }
    );
      return config;
    }
  };
  
  export default nextConfig;