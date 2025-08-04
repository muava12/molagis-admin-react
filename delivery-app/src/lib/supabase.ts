import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oabyaiyxfcbjpfmxdcrq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hYnlhaXl4ZmNianBmbXhkY3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MjQ4OTYsImV4cCI6MjA2NzEwMDg5Nn0.Emsu3Q66d1JGXIjYqHKjh9z92yxO5kfN9zzHtGLVkxQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Types for our data
export interface DeliveryItem {
  order_id: number
  delivery_status: string
  payment_method: string
  notes_for_courier?: string
  customer_name: string
  customer_phone: string
  customer_address: string
  delivery_date: string
  order_details: Array<{
    product_name: string
    quantity: number
    notes?: string
  }>
}

export interface SupabaseResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

// RPC Functions
export const courierAPI = {
  // Get deliveries for courier
  async getDeliveries(courierToken: string): Promise<SupabaseResponse<DeliveryItem[]>> {
    const { data, error } = await supabase.rpc('get_deliveries_for_courier', {
      courier_token: courierToken
    })
    
    if (error) {
      console.error('Error fetching deliveries:', error)
      return { success: false, error: { code: 'RPC_ERROR', message: error.message } }
    }
    
    return data as SupabaseResponse<DeliveryItem[]>
  },

  // Update single delivery status
  async updateDeliveryStatus(
    courierToken: string, 
    orderId: number, 
    newStatus: 'pending' | 'completed'
  ): Promise<SupabaseResponse<any>> {
    const { data, error } = await supabase.rpc('update_delivery_status', {
      courier_token: courierToken,
      target_order_id: orderId,
      new_status: newStatus
    })
    
    if (error) {
      console.error('Error updating delivery status:', error)
      return { success: false, error: { code: 'RPC_ERROR', message: error.message } }
    }
    
    return data as SupabaseResponse<any>
  },

  // Batch update all today's deliveries
  async batchUpdateTodayDeliveries(courierToken: string): Promise<SupabaseResponse<{ updated_count: number }>> {
    const { data, error } = await supabase.rpc('batch_update_today_deliveries', {
      courier_token: courierToken
    })
    
    if (error) {
      console.error('Error batch updating deliveries:', error)
      return { success: false, error: { code: 'RPC_ERROR', message: error.message } }
    }
    
    return data as SupabaseResponse<{ updated_count: number }>
  },

  // Submit daily report
  async submitDailyReport(
    courierToken: string,
    summaryNotes?: string,
    totalCodCollected?: number
  ): Promise<SupabaseResponse<any>> {
    const { data, error } = await supabase.rpc('submit_daily_report', {
      courier_token: courierToken,
      summary_notes: summaryNotes,
      total_cod_collected: totalCodCollected
    })
    
    if (error) {
      console.error('Error submitting daily report:', error)
      return { success: false, error: { code: 'RPC_ERROR', message: error.message } }
    }
    
    return data as SupabaseResponse<any>
  }
}