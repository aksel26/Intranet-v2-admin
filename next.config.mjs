// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

// const withTM = require("next-transpile-modules")(["@balkangraph/orgchart.js"]);
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@balkangraph/orgchart.js"],

  webpack(config) {
    // SVGR 설정 추가
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true, // true로 설정하면 width와 height를 props로 전달 가능
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
