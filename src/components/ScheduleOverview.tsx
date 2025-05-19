import React from 'react';
import type { Trip } from '../utils/tripSchedule';

const ScheduleOverview: React.FC<{ trips: Trip[] }> = ({ trips }) => {
  if (trips.length < 2) return null;
  return (
    <div style={{ margin: '16px 0' }}>
      <h3>Schedule Overview</h3>
      <div>
        <b>First two trips:</b> {trips[0].start} - {trips[0].end}{trips[1] ? `, ${trips[1].start} - ${trips[1].end}` : ''}
      </div>
      <div>
        <b>Last two trips:</b> {trips.length > 1 ? `${trips[trips.length - 2].start} - ${trips[trips.length - 2].end}, ` : ''}{trips.length > 0 ? `${trips[trips.length - 1].start} - ${trips[trips.length - 1].end}` : ''}
      </div>
    </div>
  );
};

export default ScheduleOverview;