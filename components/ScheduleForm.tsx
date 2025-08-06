'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@clerk/nextjs';

interface Props {
  selectedIds: string[];
}

export function ScheduleForm({ selectedIds }: Props) {
  const { user } = useUser();
  const [time, setTime] = useState('18:00');
  const [freq, setFreq] = useState('daily');
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    await fetch('/api/schedule', {
      method: 'POST',
      body: JSON.stringify({
        userId: user?.id,
        selectedIds,
        uploadTime: time,
        frequency: freq,
      }),
    });
    setLoading(false);
    alert('Schedule saved!');
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div>
        <Label>Upload Time</Label>
        <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </div>
      <div>
        <Label>Frequency</Label>
        <Select value={freq} onValueChange={setFreq}>
          <SelectTrigger><SelectValue placeholder="Frequency" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handle} disabled={loading}>{loading ? 'Saving...' : 'Save Schedule'}</Button>
    </div>
  );
}
