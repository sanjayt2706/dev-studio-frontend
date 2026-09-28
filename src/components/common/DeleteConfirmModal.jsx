import { AlertTriangle, Trash2, X } from 'lucide-react';
import { ButtonLoader } from './LoadingSystem';

const DeleteConfirmModal = ({
  isOpen,
  title = 'Delete Item',
  itemName = '',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-surface border border-red-500/30 rounded-2xl p-6 md:p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          disabled={loading}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          title="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-white uppercase tracking-tight">
              {title}
            </h3>
            <span className="text-[10px] font-mono uppercase tracking-wider text-red-400">Irreversible Action</span>
          </div>
        </div>

        <p className="text-gray-300 text-sm font-sans mb-6 leading-relaxed">
          Are you sure you want to permanently delete{' '}
          <span className="text-white font-semibold font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">
            {itemName || 'this record'}
          </span>
          ? This will instantly remove it from both the admin database and the public website.
        </p>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-red-600/30 disabled:opacity-50"
          >
            <ButtonLoader
              text="Confirm Delete"
              loadingText="Deleting..."
              isLoading={loading}
              icon={Trash2}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
