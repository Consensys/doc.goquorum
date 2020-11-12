# Getting Started with the Quorum Plugin for Remix

1. Go to the [Remix IDE](https://remix.ethereum.org), click on the Plugins tab, scroll down to **Quorum Network**, and Activate.

    ![quorum_network](images/quorum_network.png)

1. Accept the permission to allow the plugin to retrieve compilation results. This allows our plugin to use the solidity compiler to get the compiled contract binary to deploy to your Quorum node.

    ![permission](images/permission.png)

1. The plugin should now be included in the icons on the left side. Click on the Quorum icon to show the plugin.

    ![quorum_tab](images/tab_icon.png)

1. Input the geth RPC url and hit enter. If you are currently running the quorum-examples 7nodes network, the first node's url is <http://localhost:22000>

    ![geth_rpc](images/geth_rpc.png)

1. If the node is running, the plugin should now say Connected and the rest of the UI will have appeared.

    ![ui_ready](images/ui_ready.png)

1. The Quorum plugin uses results from Remix's Solidity compiler, so pull up some contract code and compile it like you normally would in Remix. The plugin will automatically receive the compiled code on each new compilation.

1. Once you have a contract compiled, it will automatically be selected in the Compiled Contracts dropdown. Input any constructor values and deploy.

    ![deploy](images/deploy.png)

1. If successful, the contract will show up in a collapsed view under 'Deployed Contracts'. Click the caret to expand.

    ![contract_collapsed](images/contract_collapsed.png)

1. From here you can call methods on the contract.

    ![method_call](images/method_call.png)

1. To create a private contract, add your Tessera public keys one at a time to the Private For multi-select box. Press enter after inputting each one to save and select.

    ![private_add](images/private_add.png)

1. Add as many peers as you want, then deploy the contract again like you did in step 7.

    ![private_multiple](images/private_multiple.png)

1. After deploying and expanding the new contract, you should see the public keys that you selected in the widget. Every method call will include the selected keys automatically.

    ![deployed_private](images/deployed_private.png)

1. Please open a GitHub issue or reach out to us on our [Slack](https://inviter.quorum.consensys.net/) with any feedback or questions!
