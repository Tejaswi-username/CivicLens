import React, { useState } from 'react';
import { Report } from '../../types/report';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import { HazardImage } from '../ui/HazardImage';
import { formatDate } from '../../utils/date';
import {
  Share2,
  Copy,
  Check,
  X,
  MessageCircle,
  Twitter,
  MapPin,
  Calendar,
  Users,
  Shield,
  ExternalLink,
  QrCode
} from 'lucide-react';
import { useReports } from '../../context/ReportContext';

interface ShareReportModalProps {
  report: Report;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareReportModal: React.FC<ShareReportModalProps> = ({
  report,
  isOpen,
  onClose
}) => {
  const { showToast } = useReports();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const currentUrl = `${window.location.origin}/reports/${report.reportId}`;

  const shareText = `🚨 Civic Hazard Alert in Bachupally:
${report.category} reported at ${report.landmark}.
Priority: ${report.priorityLevel} (Score: ${report.priorityScore})
Status: ${report.status} | Confirmed by ${report.confirmations} citizens.
Track or confirm this issue on CivicLens: ${currentUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    showToast('Report URL copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedText(true);
    showToast('Civic summary card copied to clipboard!', 'success');
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleShareTwitter = () => {
    const tweet = encodeURIComponent(
      `🚨 Civic hazard reported in Bachupally: ${report.category} at ${report.landmark}. Validated by ${report.confirmations} citizens. #CivicLens #Bachupally #FixOurRoads #SDG11 ${currentUrl}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Share Report Card</h3>
              <p className="text-[11px] text-slate-500">Raise awareness in your local community & WhatsApp groups</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Card Preview */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Visual Share Card */}
          <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 shadow-md space-y-3 relative overflow-hidden">
            {/* Card Watermark & Branding Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-700 text-white flex items-center justify-center text-[10px] font-black">
                  CL
                </div>
                <div>
                  <span className="font-extrabold text-xs tracking-tight text-slate-900 block leading-tight">
                    CIVIC LENS
                  </span>
                  <span className="text-[9px] font-semibold text-teal-700 uppercase tracking-wider block">
                    Bachupally Ward 132 • Certified Issue
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                  {report.reportId}
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded uppercase">
                  SDG 11
                </span>
              </div>
            </div>

            {/* Photo Preview */}
            <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-900">
              <HazardImage
                src={report.photoUrl}
                alt={report.category}
                category={report.category}
                description={report.description}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-white/95 text-slate-800 shadow-xs">
                  {report.category}
                </span>
              </div>
              <div className="absolute top-2 right-2">
                <PriorityBadge level={report.priorityLevel} score={report.priorityScore} showScore size="sm" />
              </div>
              <div className="absolute bottom-2 left-2">
                <StatusBadge status={report.status} size="sm" />
              </div>
            </div>

            {/* Content Summary */}
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                {report.description}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span className="truncate">{report.landmark}</span>
              </div>
            </div>

            {/* Card Footer with QR & Validations */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-600" />
                <span className="font-semibold text-slate-700">
                  {report.confirmations} Neighbors Validated
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
                <QrCode className="w-3.5 h-3.5 text-slate-500" />
                <span>civiclens.demo</span>
              </div>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={handleShareWhatsApp}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Share to WhatsApp</span>
            </button>

            <button
              onClick={handleShareTwitter}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition"
            >
              <Twitter className="w-4 h-4 fill-current" />
              <span>Share on X / Twitter</span>
            </button>
          </div>

          {/* Copy Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Direct Link'}</span>
            </button>

            <button
              onClick={handleCopyText}
              className="flex-1 py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedText ? 'Card Copied!' : 'Copy Text Card'}</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400">
          Sharing civic reports builds community consensus and accelerates municipal dispatch.
        </div>
      </div>
    </div>
  );
};
