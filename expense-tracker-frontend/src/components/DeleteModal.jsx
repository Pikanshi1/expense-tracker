function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96">

        <h2 className="text-2xl font-bold mb-3">
          Delete Expense
        </h2>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this expense?
        </p>

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>

        </div>

      </div>
    </div>
  );
}

export default DeleteModal;