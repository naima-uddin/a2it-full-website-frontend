/** @type {import('next').NextConfig} */

const nextConfig = {
  // output: "export",l
  images: { unoptimized: true },
  trailingSlash: true,
  // NOTE: Next.js 16 removed the `eslint` config key (lint no longer runs as
  // part of `next build`), so it is not set here any more.
};
export default nextConfig;
