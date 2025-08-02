import { supabase, type Customer, type CustomerInsert, type CustomerUpdate } from '@/lib/supabase'

export class CustomerService {
  // Get all customers
  static async getCustomers(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('date_created', { ascending: false })

    if (error) {
      console.error('Error fetching customers:', error)
      throw new Error('Failed to fetch customers')
    }

    return data || []
  }

  // Get customer by ID
  static async getCustomer(id: number): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching customer:', error)
      throw new Error('Failed to fetch customer')
    }

    return data
  }

  // Create new customer
  static async createCustomer(customerData: CustomerInsert): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .insert([customerData])
      .select()
      .single()

    if (error) {
      console.error('Error creating customer:', error)
      throw new Error('Failed to create customer')
    }

    return data
  }

  // Update customer
  static async updateCustomer(id: number, customerData: CustomerUpdate): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .update(customerData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating customer:', error)
      throw new Error('Failed to update customer')
    }

    return data
  }

  // Delete customer
  static async deleteCustomer(id: number): Promise<void> {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting customer:', error)
      throw new Error('Failed to delete customer')
    }
  }

  // Search customers by name
  static async searchCustomers(query: string): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .ilike('nama', `%${query}%`)
      .order('date_created', { ascending: false })

    if (error) {
      console.error('Error searching customers:', error)
      throw new Error('Failed to search customers')
    }

    return data || []
  }
}