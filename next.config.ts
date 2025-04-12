/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/wms-ui' : '',
  images: {
    unoptimized: true
  },
  // 정적 파일 경로 설정
  assetPrefix: process.env.NODE_ENV === 'production' ? '/wms-ui' : '',
  // 클라이언트 사이드 JavaScript 최적화
  experimental: {
    optimizePackageImports: ['react', 'react-dom']
  },
  // 정적 파일 경로 설정
  trailingSlash: true,
  // 정적 파일 경로 설정
  distDir: 'out'
}

export default nextConfig
