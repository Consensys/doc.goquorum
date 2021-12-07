
# GoQuorum plugin for Remix

The GoQuorum plugin for Ethereum's [Remix IDE](https://remix.ethereum.org) adds support for creating and interacting with
private contracts on a GoQuorum network.

![screenshot](../../images/remix/quorum-remix.png "screenshot")

## Using the Quorum plugin for Remix

1. Go to the [Remix IDE](https://remix.ethereum.org).
   From the left menu select the **Plugin manager** tab, scroll down to **Quorum Network**, and **Activate**.

    ![quorum_network](../../images/remix/quorum_network.png)

1. Accept the permission to allow the plugin to retrieve compilation results.
   This allows the plugin to use the Solidity compiler to get the compiled contract binary to deploy to your GoQuorum node.

    ![permission](../../images/remix/permission.png)

1. The plugin should now be included in the icons on the left side.
   Click on the Quorum icon to show the plugin.

    ![quorum_tab](../../images/remix/tab_icon.png)

1. Input the geth RPC URL and hit enter.
   If you are currently running the `quorum-examples` 7nodes network, the first node's URL is <http://localhost:20000>.

    ![geth_rpc](../../images/remix/geth_rpc.png)

1. If the node is running, the plugin says **Connected** and the rest of the UI appears.

    ![ui_ready](../../images/remix/ui_ready.png)

1. The GoQuorum plugin uses results from Remix's Solidity compiler, so pull up some contract code and compile it as you
   normally would in Remix.
   The plugin will automatically receive the compiled code on each new compilation.

1. Once you have a contract compiled, it will automatically be selected in the **Compiled Contracts** dropdown.
   Input any constructor values and deploy.

    ![deploy](../../images/remix/deploy.png)

1. If successful, the contract will show up in a collapsed view under **Deployed Contracts**.
   Click the caret to expand.

    ![contract_collapsed](../../images/remix/contract_collapsed.png)

1. From here you can call methods on the contract.

    ![method_call](../../images/remix/method_call.png)

1. To create a private contract, add your Tessera public keys one at a time to the **Private for** multi-select box.
   Press enter after inputting each one to save and select.

    ![private_add](../../images/remix/private_add.png)

1. Add as many peers as you want, then deploy the contract again as in step 7.

    ![private_multiple](../../images/remix/private_multiple.png)

1. After deploying and expanding the new contract, you should see the public keys that you selected in the widget.
   Every method call will include the selected keys automatically.

    ![deployed_private](../../images/remix/deployed_private.png)

If you have any feedback or questions, please open a GitHub issue or reach out on the [GoQuorum Discord](https://discord.gg/5U9Jwp7).

## Contributing

The GoQuorum plugin for Remix is open source and you can contribute enhancements.
Upon review of your changes you're required to complete a Contributor License Agreement (CLA) before merging.
If you have any questions about the contribution process, please email <mailto:quorum@consensys.net>.
