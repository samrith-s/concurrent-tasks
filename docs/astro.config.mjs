import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: "dark-plus",
    },
  },
  integrations: [
    starlight({
      title: "Concurrent Tasks",
      logo: {
        src: "./public/logo.svg",
      },
      social: {
        github: "https://github.com/samrith-s/concurrent-tasks",
      },
      favicon: "/logo.svg",
      customCss: ["./src/tailwind.css"],
      sidebar: [
        {
          label: "Introduction",
          autogenerate: {
            directory: "introduction",
          },
        },
        {
          label: "Reference",
          autogenerate: {
            directory: "reference",
          },
        },
        {
          label: "Guides",
          collapsed: true,
          autogenerate: {
            directory: "guides",
          },
        },
      ],
      tableOfContents: {
        maxHeadingLevel: 5,
      },
      expressiveCode: {
        styleOverrides: { borderRadius: "0.25rem" },
        frames: {
          removeCommentsWhenCopyingTerminalFrames: true,
        },
      },
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
