import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle, FileText, Lock, CreditCard, AlertCircle, Download,
  ArrowLeft, Check
} from 'lucide-react';

export default function AgreementPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  const [currentStep, setCurrentStep] = useState('agreement');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank-transfer');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b]">
        <div className="text-white text-center">
          <p className="text-xl mb-4">No booking data found</p>
          <button onClick={() => navigate('/')} className="text-cyan-400 hover:underline">
            Go to home
          </button>
        </div>
      </div>
    );
  }

  const totalAmount = booking.boarding.price * (booking.members?.length || 1);
  const depositAmount = totalAmount * 2;

  const handleSignAgreement = () => {
    if (agreedToTerms && signatureName) {
      setCurrentStep('payment');
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep('confirmation');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-[#0a1124] to-[#131d3a] border-b border-white/10 p-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h1 className="text-lg font-bold text-white">Agreement & Payment</h1>
        <div className="w-8" />
      </div>

      <div className="max-w-3xl mx-auto p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { step: 'agreement', label: 'Agreement', icon: FileText },
              { step: 'payment', label: 'Payment', icon: CreditCard },
              { step: 'confirmation', label: 'Confirmation', icon: CheckCircle }
            ].map(({ step, label, icon: Icon }) => (
              <div
                key={step}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer transition ${
                  currentStep === step
                    ? 'bg-cyan-500/20 border border-cyan-500/30'
                    : ['agreement', 'payment'].includes(step) && ['payment', 'confirmation'].includes(currentStep)
                    ? 'bg-green-500/20 border border-green-500/30'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                <Icon
                  size={24}
                  className={
                    currentStep === step
                      ? 'text-cyan-400'
                      : ['agreement', 'payment'].includes(step) && ['payment', 'confirmation'].includes(currentStep)
                      ? 'text-green-400'
                      : 'text-gray-400'
                  }
                />
                <span
                  className={`text-xs font-semibold ${
                    currentStep === step
                      ? 'text-cyan-400'
                      : ['agreement', 'payment'].includes(step) && ['payment', 'confirmation'].includes(currentStep)
                      ? 'text-green-400'
                      : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Agreement Step */}
        {currentStep === 'agreement' && (
          <div className="space-y-6">
            {/* Agreement Document */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="text-cyan-400" size={24} />
                <h2 className="text-white font-bold text-lg">Boarding Agreement</h2>
              </div>

              {/* Document Preview */}
              <div className="bg-white/10 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto border border-white/20">
                <div className="space-y-3 text-gray-300 text-sm">
                  <div>
                    <h3 className="font-bold text-white mb-2">1. BOARDING AGREEMENT</h3>
                    <p>
                      This Agreement is entered into between {booking.boarding.owner} (Owner) and the Student(s)
                      {booking.type === 'group' ? ` forming group "${booking.groupName}"` : ''}.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-white mb-2">2. TERMS & CONDITIONS</h3>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Monthly rent: Rs. {booking.boarding.price.toLocaleString()}</li>
                      <li>Security deposit: Rs. {depositAmount.toLocaleString()}</li>
                      <li>Duration: 12 months (renewable)</li>
                      <li>Check-in date: {booking.boarding.availableFrom}</li>
                      <li>Bills included: {booking.boarding.bills}</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-white mb-2">3. TENANT RESPONSIBILITIES</h3>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Maintain the room and boarding house in good condition</li>
                      <li>Pay rent on time before the 5th of each month</li>
                      <li>Adhere to house rules and regulations</li>
                      <li>Respect other residents' privacy and property</li>
                      <li>Report any maintenance issues immediately</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-white mb-2">4. OWNER RESPONSIBILITIES</h3>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Provide safe and hygienic living conditions</li>
                      <li>Maintain all facilities in working order</li>
                      <li>Ensure 24/7 security and CCTV surveillance</li>
                      <li>Return security deposit with interest after contract ends</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-white mb-2">5. HOUSE RULES</h3>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>No smoking or drinking inside the boarding house</li>
                      <li>Quiet hours: 10 PM to 8 AM</li>
                      <li>No unauthorized guests overnight</li>
                      <li>Kitchen usage restricted to designated times</li>
                      <li>Visitors must sign in at the reception</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-white mb-2">6. TERMINATION</h3>
                    <p>
                      Either party may terminate this agreement with 30 days written notice. Immediate termination
                      is allowed in case of breach of agreement.
                    </p>
                  </div>
                </div>
              </div>

              {/* Checkbox */}
              <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/30">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-white/30"
                  />
                  <span className="text-white text-sm">
                    I have read and agree to all terms and conditions of this Boarding Agreement
                  </span>
                </label>
              </div>

              {/* Signature */}
              <div className="mt-4">
                <label className="block text-white font-bold text-sm mb-2">Your Name (for Signature)</label>
                <input
                  type="text"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleSignAgreement}
              disabled={!agreedToTerms || !signatureName}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Sign & Proceed to Payment
            </button>
          </div>
        )}

        {/* Payment Step */}
        {currentStep === 'payment' && (
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <CreditCard size={24} />
                Payment Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-gray-400">Monthly Rent</span>
                  <span className="text-white font-semibold">Rs. {booking.boarding.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-gray-400">{booking.members?.length || 1} Members</span>
                  <span className="text-white font-semibold">× {booking.members?.length || 1}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-gray-400">Security Deposit (2 months)</span>
                  <span className="text-white font-semibold">Rs. {depositAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-cyan-500">
                  <span className="text-cyan-400 font-bold text-lg">Total Amount Due</span>
                  <span className="text-cyan-400 font-bold text-2xl">
                    Rs. {(depositAmount + totalAmount).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3">
                <h3 className="text-white font-bold text-sm mb-3">Payment Method</h3>
                {[
                  { id: 'bank-transfer', label: 'Bank Transfer', icon: '🏦' },
                  { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
                  { id: 'mobile', label: 'Mobile Payment', icon: '📱' }
                ].map(({ id, label, icon }) => (
                  <label
                    key={id}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                      paymentMethod === id
                        ? 'border-cyan-400 bg-cyan-500/10'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="radio"
                      value={id}
                      checked={paymentMethod === id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-xl">{icon}</span>
                    <span className="text-white font-semibold">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex gap-3">
              <AlertCircle className="text-yellow-400 flex-shrink-0" size={20} />
              <div>
                <div className="text-yellow-400 font-bold text-sm mb-1">Secure Payment</div>
                <div className="text-gray-300 text-xs">
                  Your payment is secured with 256-bit SSL encryption and PCI compliance.
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCurrentStep('agreement')}
                className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-lg transition border border-white/20"
              >
                Back
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-500 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Pay Now
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Step */}
        {currentStep === 'confirmation' && (
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-cyan-400 animate-pulse opacity-30" />
                <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-green-500 to-cyan-500">
                  <CheckCircle className="w-20 h-20 text-white" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-green-400 mb-2">Payment Successful! ✅</h2>
              <p className="text-gray-300">
                Your agreement has been signed and payment has been processed successfully.
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-400">Booking Reference</span>
                  <span className="text-cyan-400 font-bold">#BK{Math.random().toString().slice(2, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount Paid</span>
                  <span className="text-white font-bold">
                    Rs. {(depositAmount + totalAmount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Check-in Date</span>
                  <span className="text-white font-bold">{booking.boarding.availableFrom}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400 font-bold">Confirmed</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-lg transition border border-white/20"
              >
                View Dashboard
              </button>
              <button
                onClick={() => window.print()}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Download Receipt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
