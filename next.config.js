/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const withPWA = require("next-pwa")({
  dest: "public",
});

// @ts-ignore
module.exports = withPWA(nextConfig);
