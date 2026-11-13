import React, { useState } from 'react';
import { Crown, Check, Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
  setIsPro: (val: boolean) => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  isPro,
  setIsPro,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'lifetime'>('monthly');

  if (!isOpen) return null;

  const handleActivatePro = () => {
    setIsPro(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#4FE6CF]/20 to-[#062B5B]/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                ResumeStudio Pro
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Land high-paying interviews with unlimited AI career intelligence
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1">
            ✕
          </button>
        </div>

        {/* Billing cycle tabs */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Monthly Access ($12/mo)
          </button>
          <button
            onClick={() => setBillingCycle('lifetime')}
            className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer ${
              billingCycle === 'lifetime'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Lifetime Pass ($49)</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
              Save 70%
            </span>
          </button>
        </div>

        {/* Feature Checkpoints */}
        <div className="space-y-3 text-xs">
          {[
            'Unlimited High-Resolution PDF, PNG & Vector Print Exports',
            'All 100+ Designer & ATS-Friendly Blueprint Templates',
            'Full Mode 2 AI Raw-Notes-to-Resume Structuring Engine',
            'Target Job Description Keyword Gap Matcher',
            'Automated Tailored Cover Letter & LinkedIn Profile Generator',
            'Resume Recreation AI (Scan old resumes & modernize instantly)',
            'Priority Cloud Generation with Gemini 3.8 Flash',
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
              <div className="w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <button
            onClick={handleActivatePro}
            className="w-full py-3.5 px-4 rounded-xl text-xs font-bold bg-[#062B5B] hover:bg-[#062B5B]/90 text-white dark:bg-[#4FE6CF] dark:text-[#062B5B] shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isPro ? 'Keep Pro Activated' : `Unlock Pro for ${billingCycle === 'monthly' ? '$12/month' : '$49 Lifetime'}`}</span>
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>30-day money-back guarantee · Cancel anytime with 1 click</span>
          </div>
        </div>
      </div>
    </div>
  );
};
