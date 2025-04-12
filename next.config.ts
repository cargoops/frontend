/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';
const repoName = 'wms-ui';

const nextConfig = {
  output: 'export',
  basePath: isProduction ? `/${repoName}` : '',
  assetPrefix: isProduction ? `/${repoName}/` : '',
  images: {
    unoptimized: true,
    loader: 'custom'
  },
  // 클라이언트 사이드 JavaScript 최적화
  experimental: {
    optimizePackageImports: ['react', 'react-dom']
  },
  // 정적 파일 경로 설정
  trailingSlash: true,
  // webpack 설정 추가
  webpack: (config: any) => {
    config.output.publicPath = isProduction ? `/${repoName}/_next/` : '/_next/';
    return config;
  }
}

export default nextConfig
