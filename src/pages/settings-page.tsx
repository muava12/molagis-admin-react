import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Input } from '@/components/base/input/input';
import { Button } from '@/components/base/buttons/button';

export const SettingsPage: React.FC = () => {
  const [timezone, setTimezone] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimezone = async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'timezone')
        .single();

      if (error) {
        console.error('Error fetching timezone:', error);
      } else if (data) {
        setTimezone(data.value);
      }
      setLoading(false);
    };

    fetchTimezone();
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
      <div className="max-w-md">
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
    </div>
  );
};
