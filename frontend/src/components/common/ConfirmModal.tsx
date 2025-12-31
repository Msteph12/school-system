interface Props {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}

const ConfirmModal = ({ open, title, message, onConfirm, onClose, loading }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
             disabled={loading}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Promote
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
