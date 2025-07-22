import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  DollarSign, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Shield,
  Zap
} from 'lucide-react';
import { useBlockDAG } from '../hooks/useBlockDAG';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
  projectImage?: string;
}

const PRESET_AMOUNTS = [5, 10, 25, 50, 100];

export default function DonationModal({ 
  isOpen, 
  onClose, 
  projectId, 
  projectTitle, 
  projectImage 
}: DonationModalProps) {
  const { wallet, balance, sendDonation } = useBlockDAG();
  const [amount, setAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setAmount(numValue);
    }
  };

  const handleDonate = async () => {
    if (!wallet) {
      setError('Please connect your wallet first');
      return;
    }

    if (amount <= 0) {
      setError('Please enter a valid donation amount');
      return;
    }

    if (amount > balance) {
      setError('Insufficient balance');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const txId = await sendDonation(amount, projectId, message);
      setSuccess(txId);
      
      // Reset form
      setAmount(25);
      setCustomAmount('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Donation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setSuccess(null);
    setError(null);
    setIsProcessing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 rounded-t-2xl border-b border-gray-700 p-4 sm:p-6">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-white transition-colors z-10"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <div className="text-center pr-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Make a Donation</h2>
            <p className="text-gray-400 text-sm sm:text-base">Support {projectTitle}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {success ? (
            <div className="text-center">
              <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Donation Successful!</h3>
              <p className="text-gray-400 mb-4 text-sm sm:text-base">
                Your donation of {amount} BDAG has been sent successfully.
              </p>
              <div className="bg-gray-800 rounded-lg p-3 sm:p-4 mb-6">
                <p className="text-xs sm:text-sm text-gray-400 mb-2">Transaction ID:</p>
                <p className="text-white font-mono text-xs break-all">{success}</p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => window.open(`https://testnet.blockdag.network/tx/${success}`, '_blank')}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 sm:py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View on BlockDAG</span>
                </button>
                <button
                  onClick={handleClose}
                  className="w-full bg-gray-700 hover:bg-gray-600 py-2.5 sm:py-3 rounded-lg font-semibold text-white transition-all duration-200 text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Project Info */}
              {projectImage && (
                <img 
                  src={projectImage} 
                  alt={projectTitle}
                  className="w-full h-24 sm:h-32 object-cover rounded-lg mb-4"
                />
              )}

              {/* Wallet Status */}
              {!wallet ? (
                <div className="bg-yellow-900 bg-opacity-50 border border-yellow-600 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2 text-yellow-200">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="font-semibold text-sm sm:text-base">Wallet Required</span>
                  </div>
                  <p className="text-yellow-300 text-xs sm:text-sm mt-1">
                    Please connect your Algorand wallet to make a donation.
                  </p>
                </div>
              ) : (
                <div className="bg-blue-900 bg-opacity-50 border border-blue-600 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-blue-200">
                      <Shield className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">Wallet Connected</span>
                    </div>
                    <span className="text-white font-semibold text-sm sm:text-base">{balance.toFixed(2)} ALGO</span>
                  </div>
                </div>
              )}

              {/* Amount Selection */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-white font-semibold mb-3 text-sm sm:text-base">Donation Amount (BDAG)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {PRESET_AMOUNTS.map((presetAmount) => (
                    <button
                      key={presetAmount}
                      onClick={() => handleAmountSelect(presetAmount)}
                      className={`py-2 sm:py-2.5 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                        amount === presetAmount && !customAmount
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      {presetAmount} BDAG
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
                  min="0"
                  step="0.1"
                />
                <p className="text-gray-400 text-xs sm:text-sm mt-2">
                  ≈ ${(amount * 0.15).toFixed(2)} USD
                </p>
              </div>

              {/* Message */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Message (Optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave a message of support..."
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none text-sm sm:text-base"
                  rows={3}
                  maxLength={200}
                />
                <p className="text-gray-400 text-xs mt-1">{message.length}/200 characters</p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-900 bg-opacity-50 border border-red-600 rounded-lg p-3 mb-4">
                  <div className="flex items-start space-x-2 text-red-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm">{error}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleDonate}
                  disabled={!wallet || isProcessing || amount <= 0}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-2.5 sm:py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4" />
                      <span>Donate {amount} BDAG</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleClose}
                  disabled={isProcessing}
                  className="w-full bg-gray-700 hover:bg-gray-600 py-2.5 sm:py-3 rounded-lg font-semibold text-white transition-all duration-200 disabled:opacity-50 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-green-400" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-blue-400" />
                    <span>Instant</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ExternalLink className="w-3 h-3 text-purple-400" />
                    <span>Transparent</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}