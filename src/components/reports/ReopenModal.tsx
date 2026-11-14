import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { AlertTriangle, Send } from 'lucide-react';

interface ReopenModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  onReopen: (reason: string) => void;
}

export const ReopenModal: React.FC<ReopenModalProps> = ({
  isOpen,
  onClose,
  reportId,
  onReopen
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a reason explaining why the issue is still unresolved.');
      return;
    }
    if (reason.trim().length < 15) {
      setError('Please provide a slightly more descriptive reason (at least 15 characters).');
      return;
    }
    setError('');
    onReopen(reason);
    setReason('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reopen Issue ${reportId}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Reopening an issue notifies the municipal department that the resolution was either
            incomplete or that the problem has resurfaced. Please detail what you observed on site.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1.5">
            Why is this issue still unresolved? <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. The pothole was filled with loose gravel, but it has washed away after yesterday's rain and the crater is exposed again..."
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
          />
          {error && <p className="text-xs text-rose-600 mt-1 font-medium">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Reopen Request</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
