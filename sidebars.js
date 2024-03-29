// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docSidebar: [
    {
      type: "category",
      label: "Install",
      link: {
        type: "doc",
        id: "deploy/install-index",
      },
      items: [
        {
          type: "autogenerated",
          dirName: "deploy/install",
        },
      ],
    },
    {
      type: "autogenerated",
      dirName: "deploy/upgrade",
    },
    "deploy/deployment-overview",
  ],
  configureAndManageSidebar: [
    {
      type: "autogenerated",
      dirName: "configure-and-manage",
    },
  ],
  developSidebar: [
    "develop/client-libraries",
    "develop/connecting-to-a-node",
    "develop/json-rpc-apis",
    "develop/smart-contracts-transactions",
    {
      type: "category",
      label: "Manage keys",
      link: {
        type: "doc",
        id: "develop/manage-keys-index",
      },
      items: [
        {
          type: "autogenerated",
          dirName: "develop/manage-keys",
        },
      ],
    },
  ],
  learnSidebar: [
    {
      type: "category",
      label: "Blockchain basics",
      link: {
        type: "doc",
        id: "concepts/blockchain-basics-index",
      },
      items: [
        {
          type: "autogenerated",
          dirName: "concepts/blockchain-basics",
        },
      ],
    },
    "concepts/architecture",
    {
      type: "category",
      label: "Consensus",
      link: {
        type: "doc",
        id: "concepts/consensus-index",
      },
      items: [
        {
          type: "autogenerated",
          dirName: "concepts/consensus",
        },
      ],
    },
    "concepts/account-management",
    "concepts/free-gas-network",
    "concepts/gas-enabled-network",
    {
      type: "category",
      label: "Privacy",
      link: {
        type: "doc",
        id: "concepts/privacy-index",
      },
      items: [
        {
          type: "autogenerated",
          dirName: "concepts/privacy",
        },
      ],
    },
    "concepts/permissions-overview",
    "concepts/plugins",
    "concepts/security-framework",
    "concepts/multi-tenancy",
    "concepts/qlight-node",
    "concepts/profiling",
    "concepts/network-and-chain-id",
    "develop/develop-plugins",
  ],
  tutorialSidebar: [
    {
      type: "category",
      label: "GoQuorum Developer Quickstart",
      link: {
        type: "doc",
        id: "tutorials/quickstart-index",
      },
      items: [
        {
          type: "autogenerated",
          dirName: "tutorials/quorum-dev-quickstart",
        },
      ],
    },
    {
      type: "category",
      label: "Create a private network",
      items: [
        {
          type: "autogenerated",
          dirName: "tutorials/private-network",
        },
      ],
    },
    {
      type: "category",
      label: "Smart contracts and transactions",
      items: [
        {
          type: "autogenerated",
          dirName: "tutorials/contracts",
        },
      ],
    },
    {
      type: "category",
      label: "Kubernetes",
      link: {
        type: "doc",
        id: "tutorials/kubernetes-index",
      },
      items: [
        {
          type: "autogenerated",
          dirName: "tutorials/kubernetes",
        },
      ],
    },
    "tutorials/create-privacy-enabled-network",
    "tutorials/send-private-transaction",
    "tutorials/create-permissioned-network",
    "tutorials/use-plugin",
  ],
  referenceSidebar: [
    {
      type: "autogenerated",
      dirName: "reference",
    },
  ],
};

module.exports = sidebars;
