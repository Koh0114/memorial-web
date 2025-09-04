// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 당장 배포가 급하면 임시로 켜두고,
  // 나중에 코드 에러를 고치면 아래 두 옵션은 지우는 걸 추천.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

module.exports = nextConfig;