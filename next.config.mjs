import withSerwistInit from "@serwist/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development",
  },
};

const withSerwist = withSerwistInit({
  disable: true,
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
});

export default withSerwist(nextConfig);
