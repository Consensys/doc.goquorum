---
template: home.html
title: GoQuorum Enterprise Ethereum Client
description: GoQuorum is an open-source Ethereum client developed under the LGPL license and written in Go.
  GoQuorum runs private, permissioned networks and implements proof of authority (IBFT, QBFT, Raft, and Clique)
  consensus mechanisms.

hide:
  - toc
  - navigation

profiles:
  - link: deploy/install/getting-started-overview/
    title: Deploy GoQuorum
    text: Install GoQuorum or upgrade from an earlier version.
      Run the Quorum Developer Quickstart to set up a local development environment.
    image: assets/illustrations/undraw_to_the_stars_qhyy.svg

  - link: configure-and-manage/configure/consensus-protocols/ibft/
    title: Configure and manage
    text: Configure and manage GoQuorum consensus protocols, genesis files, permissioning,
      monitoring, and other network components.
    image: assets/illustrations/undraw_programming_re_kg9v.svg

  - link: develop/connecting-to-a-node/
    title: Develop applications
    text: Connect to nodes, access the JSON-RPC APIs, and use client libraries to develop
      applications for the GoQuorum network.
    image: assets/illustrations/undraw_web_development_0l6v.svg

  - link: concepts/blockchain-basics/what-is-blockchain/
    title: Learn about GoQuorum
    text: Read about blockchain concepts and GoQuorum architecture and features.
    image: assets/illustrations/undraw_knowledge_g-5-gf.svg

  - link: tutorials/quorum-dev-quickstart/getting-started/
    title: Try the tutorials
    text: Use the Quorum Developer Quickstart, deploy and interact with smart contracts, and create private networks.
    image: assets/illustrations/undraw_setup_wizard_re_nday.svg

  - link: reference/cli-syntax/
    title: Reference information
    text: See APIs, command line options, and other technical descriptions.
    image: assets/illustrations/undraw_preferences_popup_wbfw.svg
---

This is a landing page, you can not add markdown content directly.

Configure the landing page [using meta tags](https://squidfunk.github.io/mkdocs-material/reference/meta-tags/) in the header:

```markdown
---
title: Page title
description: Page description

hide:
- toc
- navigation

illustration: assets/illustrations/undraw_completed_steps_re_h9wc.svg

links:
  - link: link-url/
    title: Link title

profiles:
  - link: url
    title: title
    text: this can be a
      multiline text
    image: asset path
---
```
