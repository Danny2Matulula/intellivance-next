/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/about",
        destination: "/#studio",
        permanent: false,
      },
      {
        source: "/assessment",
        destination: "/#contact",
        permanent: false,
      },
      {
        source: "/assessment/:path*",
        destination: "/#contact",
        permanent: false,
      },
      {
        source: "/blog",
        destination: "/",
        permanent: false,
      },
      {
        source: "/blog/:path*",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
