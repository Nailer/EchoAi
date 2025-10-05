import React, { useState, useContext } from "react";
import {
  Wallet,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle,
  Loader2,
  Zap,
  Shield,
  RefreshCw,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useBlockDAG } from "../hooks/useBlockDAG";
// @ts-ignore: No declaration file for BlockDAGWallet (JSX module)
import { CrowdFundingContext } from "../../Context/EchoAid";

export default function BlockDAGWallet() {
  // for the connect wallet context
  const { currentAccount, connectWallet, balance, createCampaign } = useContext(
    CrowdFundingContext
  ) as {
    currentAccount?: string | null;
    connectWallet: (provider?: string) => void;
    balance: number | undefined;
    createCampaign: any;
  };

  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: "",
    deadline: "",
  });

  // const handleChange = (e) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

  const createNewCampaign = async ({ e }: any) => {
    e?.preventDefault();
    try {
      const data = await createCampaign(form);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async ({ e }: any) => {
    e?.preventDefault();
    try {
      await createCampaign(form); // ✅ Call function directly
      alert("Campaign created successfully!");
    } catch (err) {
      console.error("Failed to create campaign:", err);
      alert("Error creating campaign.");
    }
  };

  // const {
  //   wallet,
  //   balance,
  //   isConnecting,
  //   error,
  //   networkStats,
  //   connectWallet,
  //   disconnectWallet,
  //   refreshData,
  // } = useBlockDAG();

  // const [copied, setCopied] = useState(false);

  // const handleCopyAddress = async () => {
  //   if (wallet?.address) {
  //     await navigator.clipboard.writeText(wallet.address);
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 2000);
  //   }
  // };

  // const formatAddress = (address: string) => {
  //   return `${address.slice(0, 8)}...${address.slice(-8)}`;
  // };

  // const formatNumber = (num: number) => {
  //   if (num >= 1000000) {
  //     return `${(num / 1000000).toFixed(1)}M`;
  //   } else if (num >= 1000) {
  //     return `${(num / 1000).toFixed(1)}K`;
  //   }
  //   return num.toLocaleString();
  // };

  if (currentAccount) {
    return (
      <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-2xl p-6 border border-purple-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">BlockDAG Wallet</h3>
              <p className="text-purple-200 text-sm capitalize">
                {currentAccount} connected
              </p>
            </div>
          </div>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all duration-200">
            <RefreshCw className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-purple-200 text-sm">Balance</span>
              <div className="text-right">
                {/* <p className="text-white font-bold text-lg">{balance.toFixed(2)} BDAG</p> */}
                {/* <p className="text-purple-300 text-xs">≈ ${(balance * 0.15).toFixed(2)} USD</p> */}
              </div>
            </div>
          </div>

          {/* Network Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
              <TrendingUp className="w-4 h-4 text-green-400 mx-auto mb-1" />
              <div className="text-xs text-purple-300">TPS</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
              <Zap className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
              <div className="text-xs text-purple-300">Confirmation</div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 py-2 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 text-sm">
              <label htmlFor="">Title</label>
              <input
                type="text"
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                placeholder="Enter the title"
                className="bg-pink-500 text-white placeholder-white text-sm px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 "
              />
            </button>
          </div>
          <div className="flex space-x-3">
            <button className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 py-2 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 text-sm">
              <label htmlFor="">Description</label>
              <input
                type="text"
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                className="bg-pink-500 text-white placeholder-white text-sm px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 "
              />
            </button>
          </div>
          <div className="flex space-x-3">
            <button className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 py-2 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 text-sm">
              <label htmlFor="">Amount</label>
              <input
                type="number"
                onChange={(e) =>
                  setForm({
                    ...form,
                    amount: e.target.value,
                  })
                }
                className="bg-pink-500 text-white placeholder-white text-sm px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 "
              />
            </button>
          </div>
          <div className="flex space-x-3">
            <button className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 py-2 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 text-sm">
              <label htmlFor="">Deadline</label>
              <input
                type="date"
                onChange={(e) =>
                  setForm({
                    ...form,
                    deadline: e.target.value,
                  })
                }
                className="bg-pink-500 text-white placeholder-white text-sm px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 "
              />
            </button>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={(e) => createNewCampaign(e)}
              className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 py-2 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Create Campaign</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="backgroundMain">
      <div className="px-4 mx-auto py-5 sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
        <div className="relative flex items-center justify-between">
          {!currentAccount && (
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Connect BlockDAG Wallet
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Connect your wallet to make ultra-fast, secure donations on
                  the BlockDAG network
                </p>

                {/* Network Stats Preview */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <div className="text-sm font-bold text-white">1.2</div>
                    <div className="text-xs text-gray-400">TPS</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                    <div className="text-sm font-bold text-white">750,000</div>
                    <div className="text-xs text-gray-400">Confirmation</div>
                  </div>
                </div>

                <button
                  onClick={() => connectWallet()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <>
                    <Wallet className="w-4 h-4" />
                    <span>Connect BlockDAG Wallet</span>
                  </>
                </button>

                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Shield className="w-3 h-3 text-green-400" />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span>Ultra-Fast</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Activity className="w-3 h-3 text-purple-400" />
                      <span>DAG Technology</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
