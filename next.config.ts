/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/wms-ui' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/wms-ui/' : '',
  images: {
    unoptimized: true
  },
  // 클라이언트 사이드 JavaScript 최적화
  experimental: {
    optimizePackageImports: ['react', 'react-dom']
  },
  // 정적 파일 경로 설정
  trailingSlash: true,
  // 빌드 출력 디렉토리
  distDir: 'dist'
}

export default nextConfig
