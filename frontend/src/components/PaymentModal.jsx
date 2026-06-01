import React, { useState } from 'react';

export default function PaymentModal({ isOpen, onClose, subtotal, onConfirm }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm();
    setCardNumber('');
    setExpiry('');
    setCvv('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6 animate-fade-in">
      {/* Modal Body */}
      <div className="bg-[#111118] p-8 rounded-2xl border border-zinc-800/60 max-w-md w-full flex flex-col shadow-[0_0_30px_rgba(99,102,241,0.15)] animate-scale-in">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-sm font-extrabold tracking-widest uppercase text-[#FFFFFF]">Checkout Billing</h2>
          <div className="flex justify-between items-center mt-4 text-xs">
            <span className="text-[#8F9CAE] font-bold">Order Summary</span>
            <span className="font-black text-[#FFFFFF] text-sm">${subtotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Billing details form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[#8F9CAE] uppercase tracking-wider">
              Card Number
            </label>
            <input
              type="text"
              required
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="4000 1234 5678 9010"
              className="bg-[#191924] text-[#FFFFFF] text-xs px-4 py-3 rounded-lg border border-zinc-800/60 outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-transparent transition-all placeholder-[#8F9CAE]/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#8F9CAE] uppercase tracking-wider">
                Expiry Date
              </label>
              <input
                type="text"
                required
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                className="bg-[#191924] text-[#FFFFFF] text-xs px-4 py-3 rounded-lg border border-zinc-800/60 outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-transparent transition-all placeholder-[#8F9CAE]/20"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#8F9CAE] uppercase tracking-wider">
                CVV
              </label>
              <input
                type="text"
                required
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                className="bg-[#191924] text-[#FFFFFF] text-xs px-4 py-3 rounded-lg border border-zinc-800/60 outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-transparent transition-all placeholder-[#8F9CAE]/20"
              />
            </div>
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            className="mt-4 bg-[#6366F1] text-[#FFFFFF] text-xs font-bold uppercase tracking-widest py-3.5 rounded-lg hover:opacity-90 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all cursor-pointer"
          >
            Process Payment
          </button>

          {/* Cancel button */}
          <button
            type="button"
            onClick={onClose}
            className="text-[10px] text-[#8F9CAE] hover:text-[#FFFFFF] transition-colors underline py-2 cursor-pointer font-bold uppercase tracking-wider"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
