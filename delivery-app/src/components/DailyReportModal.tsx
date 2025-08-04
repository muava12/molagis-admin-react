import { useState } from 'react'

interface DailyReportModalProps {
  onSubmit: (summaryNotes?: string, totalCod?: number) => void
  onClose: () => void
  hasCodDeliveries: boolean
}

const DailyReportModal: React.FC<DailyReportModalProps> = ({ 
  onSubmit, 
  onClose, 
  hasCodDeliveries 
}) => {
  const [summaryNotes, setSummaryNotes] = useState('')
  const [totalCod, setTotalCod] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const codAmount = hasCodDeliveries && totalCod ? parseFloat(totalCod) : undefined
      await onSubmit(summaryNotes.trim() || undefined, codAmount)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    onSubmit()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Laporan Akhir Hari
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Summary Notes */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
              Ringkasan Pengantaran Hari Ini
              <span className="text-gray-500 font-normal"> (opsional)</span>
            </label>
            <textarea
              id="summary"
              value={summaryNotes}
              onChange={(e) => setSummaryNotes(e.target.value)}
              placeholder="Contoh: Pengantaran si A terlambat karena hujan, paket si B saya bawa lagi tidak ada orangnya..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Catatan ini akan membantu admin memahami situasi pengantaran hari ini
            </p>
          </div>

          {/* COD Amount (only show if there are COD deliveries) */}
          {hasCodDeliveries && (
            <div>
              <label htmlFor="cod-total" className="block text-sm font-medium text-gray-700 mb-2">
                Total Dana COD Diterima
                <span className="text-red-500"> *</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  Rp
                </span>
                <input
                  id="cod-total"
                  type="number"
                  value={totalCod}
                  onChange={(e) => setTotalCod(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="1000"
                  required={hasCodDeliveries}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Masukkan total uang COD yang berhasil dikumpulkan hari ini
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Selamat! Semua pengiriman hari ini telah selesai.</p>
                <p>Laporan ini akan dikirim ke admin untuk evaluasi dan pencatatan.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleSkip}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Lewati
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (hasCodDeliveries && !totalCod)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Mengirim...
                </div>
              ) : (
                'Kirim Laporan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DailyReportModal