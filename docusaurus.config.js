const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

const isDev = process.env.NODE_ENV === "development";
const baseUrl = isDev ? "/" : "/";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "ConsenSys GoQuorum",
  tagline:
    "An open-source Ethereum client, written in Go, that runs private, permissioned networks and implements proof of authority consensus mechanisms.",
  url: "https://docs.goquorum.consensys.net",
  baseUrl,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  favicon: "img/favicon.svg",
  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "ConsenSys", // Usually your GitHub org/user name.
  projectName: "doc.goquorum", // Usually your repo name.
  deploymentBranch: "gh-pages", // Github Pages deploying branch

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Set a base path separate from default /docs
          editUrl: "https://github.com/ConsenSys/doc.goquorum/tree/main/",
          path: "docs",
          routeBasePath: "/",
          // @ts-ignore
          // eslint-disable-next-line global-require
          remarkPlugins: [require("remark-docusaurus-tabs")],
          include: ["**/*.md", "**/*.mdx"],
          exclude: [
            "**/_*.{js,jsx,ts,tsx,md,mdx}",
            "**/_*/**",
            "**/*.test.{js,jsx,ts,tsx}",
            "**/__tests__/**",
          ],
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          includeCurrentVersion: true,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        // The application ID provided by Algolia
        appId: "NSRFPEJ4NC",

        // Public API key: it is safe to commit it
        apiKey: "cea41b975ad6c9a01408dfda6e0061d3",

        indexName: "goquorum",

        // Optional: see doc section below
        contextualSearch: true,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        externalUrlRegex: "external\\.com|domain\\.com",

        // Optional: Algolia search parameters
        searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: "search",

        // ... other Algolia params
      },
      // announcementBar: {
      //   id: "announcement_bar",
      //   content: "⛔️ This documentation site is still under construction! 🚧",
      //   backgroundColor: "#fafbfc",
      //   textColor: "#091E42",
      //   isCloseable: false,
      // },
      colorMode: {
        defaultMode: "light",
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 5,
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      navbar: {
        title: "GoQuorum",
        logo: {
          alt: "GoQuorum",
          src: "img/logo.svg",
          srcDark: "img/logo_dark.svg",
          width: 32,
          height: 32,
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "docSidebar",
            docId: "index",
            position: "left",
            label: "Deploy",
          },
          {
            type: "docSidebar",
            sidebarId: "learnSidebar",
            position: "left",
            label: "Learn",
          },
          {
            type: "docSidebar",
            sidebarId: "configureAndManageSidebar",
            position: "left",
            label: "Configure",
          },
          {
            type: "docSidebar",
            sidebarId: "developSidebar",
            position: "left",
            label: "Develop",
          },
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Tutorials",
          },
          {
            type: "docSidebar",
            sidebarId: "referenceSidebar",
            position: "left",
            label: "Reference",
          },

          {
            href: "https://github.com/ConsenSys/quorum",
            className: "header-github-link",
            position: "right",
          },
          {
            href: "https://discord.gg/5U9Jwp7",
            className: "header-discord-link",
            position: "right",
          },
          {
            href: "https://twitter.com/consensys",
            className: "header-twitter-link",
            position: "right",
          },
          {
            href: "https://hub.docker.com/r/quorumengineering/quorum",
            className: "header-dockerhub-link",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Deploy",
                to: "/deploy/install/overview",
              },
              {
                label: "Learn",
                to: "/concepts/blockchain-basics",
              },
              {
                label: "Tutorials",
                to: "/tutorials/quorum-dev-quickstart",
              },
              {
                label: "Reference",
                to: "/reference/cli-syntax",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.gg/5U9Jwp7",
              },
              {
                label: "Issues",
                href: "https://github.com/ConsenSys/quorum/issues",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Documentation on GitHub",
                href: "https://github.com/ConsenSys/doc.goquorum",
              },
              {
                label: "ConsenSys",
                href: "https://consensys.net",
              },
              {
                to: "/support",
                label: "Support",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} ConsenSys, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["solidity", "toml"],
      },
      languageTabs: [
        {
          highlight: "bash",
          language: "curl",
          logoClass: "bash",
        },
        {
          highlight: "python",
          language: "python",
          logoClass: "python",
        },
        {
          highlight: "go",
          language: "go",
          logoClass: "go",
        },
        {
          highlight: "javascript",
          language: "nodejs",
          logoClass: "nodejs",
        },
      ],
    }),
  plugins: [
    [
      "@docusaurus/plugin-google-gtag",
      {
        trackingID: "G-JSG72PC2R1",
        anonymizeIP: true,
      },
    ],
    [
      "@docusaurus/plugin-google-tag-manager",
      {
        containerId: "GTM-WW76KXP",
      },
    ],
  ],
  themes: [],
};

module.exports = config;
