import React from 'react'
import type { DeliveryItem } from '../lib/supabase'

interface DeliveryListItemProps {
  delivery: DeliveryItem
  onStatusChange: (orderId: number, newStatus: 'pending' | 'completed') => void
}

const DeliveryListItem: React.FC<DeliveryListItemProps> = ({ delivery, onStatusChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 p-4">
      <div className="flex items-start gap-4">
        {/* Large Radio Button */}
        <div className="flex-shrink-0 pt-1">
          <input
            type="radio"
            name={`delivery-${delivery.order_id}`}
            checked={delivery.delivery_status === 'completed'}
            onChange={(e) => {
              if (e.target.checked) {
                onStatusChange(delivery.order_id, 'completed')
              }
            }}
            className="w-10 h-10 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 focus:ring-2"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {delivery.customer_name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-2">
            {delivery.customer_address}
          </p>
          
          <div className="text-sm text-gray-500 mb-3">
            {delivery.order_details.map((item, index) => (
              <span key={index}>
                {item.quantity}x {item.product_name}
                {index < delivery.order_details.length - 1 && ', '}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                const phone = delivery.customer_phone.replace(/\D/g, '')
                const message = `Halo ${delivery.customer_name}, pesanan Anda sedang dalam perjalanan!`
                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
            >
              Chat WhatsApp
            </button>
            
            <button
              onClick={() => {
                const address = encodeURIComponent(delivery.customer_address)
                window.open(`https://maps.google.com/?q=${address}`, '_blank')
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryListItem