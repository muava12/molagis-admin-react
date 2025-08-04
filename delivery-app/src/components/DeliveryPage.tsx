import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { courierAPI, type DeliveryItem } from '../lib/supabase'
import DeliveryListItem from './DeliveryListItem'
import DailyReportModal from './DailyReportModal'
import AlertBanner from './AlertBanner'

const DeliveryPage: React.FC = () => {
  const [courierToken, setCourierToken] = useState<string>('')
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [completedDeliveries, setCompletedDeliveries] = useState<DeliveryItem[]>([])
  const [pendingDeliveries, setPendingDeliveries] = useState<DeliveryItem[]>([])

  const { token } = useParams<{ token: string }>()

  // Set token from URL params
  useEffect(() => {
    if (token) {
      setCourierToken(token)
    } else {
      setError('Token kurir tidak ditemukan di URL')
    }
  }, [token])

  // Load deliveries when token is available
  useEffect(() => {
    if (courierToken) {
      loadDeliveries()
    }
  }, [courierToken])

  // Separate deliveries by status
  useEffect(() => {
    const pending = deliveries.filter(d => d.delivery_status === 'pending')
    const completed = deliveries.filter(d => d.delivery_status === 'completed')
    setPendingDeliveries(pending)
    setCompletedDeliveries(completed)
  }, [deliveries])

  const loadDeliveries = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await courierAPI.getDeliveries(courierToken)
      
      if (response.success && response.data) {
        setDeliveries(response.data)
      } else {
        setError(response.error?.message || 'Gagal memuat data pengiriman')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memuat data')
      console.error('Error loading deliveries:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeliveryStatusChange = async (orderId: number, newStatus: 'pending' | 'completed') => {
    try {
      const response = await courierAPI.updateDeliveryStatus(courierToken, orderId, newStatus)
      
      if (response.success) {
        // Update local state
        setDeliveries(prev => 
          prev.map(delivery => 
            delivery.order_id === orderId 
              ? { ...delivery, delivery_status: newStatus }
              : delivery
          )
        )

        // Check if this was the last pending delivery
        const remainingPending = deliveries.filter(d => 
          d.delivery_status === 'pending' && d.order_id !== orderId
        )
        
        if (remainingPending.length === 0 && newStatus === 'completed') {
          setShowReportModal(true)
        }
      } else {
        alert(response.error?.message || 'Gagal mengubah status pengiriman')
      }
    } catch (err) {
      alert('Terjadi kesalahan saat mengubah status')
      console.error('Error updating delivery status:', err)
    }
  }

  const handleBatchComplete = async () => {
    try {
      const response = await courierAPI.batchUpdateTodayDeliveries(courierToken)
      
      if (response.success) {
        // Reload deliveries to get updated data
        await loadDeliveries()
        setShowReportModal(true)
      } else {
        alert(response.error?.message || 'Gagal menyelesaikan semua pengiriman')
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menyelesaikan pengiriman')
      console.error('Error batch updating deliveries:', err)
    }
  }

  const handleReportSubmit = async (summaryNotes?: string, totalCod?: number) => {
    try {
      const response = await courierAPI.submitDailyReport(courierToken, summaryNotes, totalCod)
      
      if (response.success) {
        setShowReportModal(false)
        alert('Laporan harian berhasil dikirim!')
      } else {
        alert(response.error?.message || 'Gagal mengirim laporan')
      }
    } catch (err) {
      alert('Terjadi kesalahan saat mengirim laporan')
      console.error('Error submitting report:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data pengiriman...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadDeliveries}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AlertBanner courierToken={courierToken} />
      
      {/* Header */}
      <div className="bg-gray-100 pt-6 pb-4">
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-lg font-medium text-gray-700 mb-4">
            Pengantaran Senin, 4 Agt 2025
          </h1>
          
          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mb-6">
            <button
              onClick={loadDeliveries}
              className="bg-blue-400 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-500 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={handleBatchComplete}
              className="bg-orange-400 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-500 transition-colors"
            >
              Delivered
            </button>
          </div>
          
          {/* Counter */}
          <p className="text-gray-600 text-sm mb-6">
            Jumlah antaran: {deliveries.length} (Belum diantar: {pendingDeliveries.length})
          </p>
        </div>
      </div>

      {/* Delivery List */}
      <div className="max-w-md mx-auto px-4 pb-6">
        {/* Pending Deliveries */}
        {pendingDeliveries.map((delivery) => (
          <DeliveryListItem
            key={`${delivery.order_id}-${delivery.delivery_date}`}
            delivery={delivery}
            onStatusChange={handleDeliveryStatusChange}
          />
        ))}

        {/* Completed Deliveries */}
        {completedDeliveries.map((delivery) => (
          <DeliveryListItem
            key={`${delivery.order_id}-${delivery.delivery_date}`}
            delivery={delivery}
            onStatusChange={handleDeliveryStatusChange}
          />
        ))}

        {deliveries.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">📦</div>
            <p className="text-gray-600">Tidak ada pengiriman untuk hari ini</p>
          </div>
        )}
      </div>

      {/* Daily Report Modal */}
      {showReportModal && (
        <DailyReportModal
          onSubmit={handleReportSubmit}
          onClose={() => setShowReportModal(false)}
          hasCodDeliveries={deliveries.some(d => d.payment_method === 'cod')}
        />
      )}
    </div>
  )
}

export default DeliveryPage