import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface AlertBannerProps {
  courierToken: string
}

interface AlertMessage {
  message: string
  sent_at: string
}

const AlertBanner: React.FC<AlertBannerProps> = ({ courierToken }) => {
  const [alert, setAlert] = useState<AlertMessage | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!courierToken) return

    // Subscribe to real-time alerts for this courier
    const channelName = `courier-${courierToken}`
    
    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'new_alert' }, (payload) => {
        console.log('Received alert:', payload)
        if (payload.payload) {
          setAlert(payload.payload as AlertMessage)
          setIsVisible(true)
          
          // Auto-hide after 10 seconds
          setTimeout(() => {
            setIsVisible(false)
          }, 10000)
        }
      })
      .subscribe((status) => {
        console.log('Realtime subscription status:', status)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [courierToken])

  const handleDismiss = () => {
    setIsVisible(false)
  }

  if (!alert || !isVisible) {
    return null
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 mt-4 rounded-r-lg shadow-sm animate-slide-down">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Pesan dari Admin
          </h3>
          <div className="mt-1 text-sm text-yellow-700">
            <p>{alert.message}</p>
          </div>
          <div className="mt-2 text-xs text-yellow-600">
            {new Date(alert.sent_at).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={handleDismiss}
            className="inline-flex text-yellow-400 hover:text-yellow-600 focus:outline-none focus:text-yellow-600 transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AlertBanner