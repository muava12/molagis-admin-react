import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Input } from '../components/base/input/input';
import { Button } from '../components/base/buttons/button';
import { Table } from '../components/application/table/table';

interface ActiveCustomer {
  id: string;
  name: string;
  pending_days: number;
}

interface ActiveCustomerData {
  count: number;
  customers: ActiveCustomer[];
}

export const SettingsPage: React.FC = () => {
  const [timezone, setTimezone] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeCustomerData, setActiveCustomerData] = useState<ActiveCustomerData | null>(null);
  const [customerError, setCustomerError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch Timezone
      const { data: tzData, error: tzError } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'timezone')
        .single();

      if (tzError) {
        console.error('Error fetching timezone:', tzError);
      } else if (tzData) {
        setTimezone(tzData.value);
      }

      // Fetch Active Customers
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_active_customer_count');

      if (rpcError) {
        console.error('Error fetching active customers:', rpcError);
        setCustomerError('Failed to load active customer data.');
      } else if (rpcData && rpcData.success) {
        setActiveCustomerData(rpcData.data);
      } else {
        setCustomerError(rpcData?.error?.message || 'An unknown error occurred.');
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    const { error } = await supabase
      .from('settings')
      .update({ value: timezone })
      .eq('key', 'timezone');

    if (error) {
      alert('Error updating timezone');
    } else {
      alert('Timezone updated successfully');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      
      {/* Timezone Settings */}
      <div className="max-w-md mb-8">
        <Input
          label="Timezone"
          value={timezone}
          onChange={setTimezone}
        />
        <Button onClick={handleSave} className="mt-4">
          Save
        </Button>
        <Button onClick={() => setTimezone('Asia/Jakarta')} className="mt-4 ml-2">
          Set to Jakarta
        </Button>
      </div>

      {/* Active Customer Report */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Active Customer Details</h2>
        {customerError && (
          <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
            {customerError}
          </div>
        )}
        {activeCustomerData && (
          <div>
            <p className="mb-4 text-sm text-gray-600">
              Showing {activeCustomerData.count} customers with pending orders
            </p>
            {activeCustomerData.customers.length > 0 ? (
              <Table>
                <Table.Header>
                  <Table.Head label="Customer Name" />
                  <Table.Head label="Pending Days" />
                </Table.Header>
                <Table.Body items={activeCustomerData.customers}>
                  {(customer) => (
                    <Table.Row key={customer.id}>
                      <Table.Cell>{customer.name}</Table.Cell>
                      <Table.Cell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          customer.pending_days > 7
                            ? 'bg-red-100 text-red-800'
                            : customer.pending_days > 3
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {customer.pending_days} days
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No customers with pending orders found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
