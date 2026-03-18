/** @type {import('next').NextConfig} */
console.log('[build env]', {
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_ENV: process.env.VERCEL_ENV,
});

const nextConfig = {};

module.exports = nextConfig;

