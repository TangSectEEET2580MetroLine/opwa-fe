import React, { useState, useRef, useEffect } from 'react';
import type { Trip } from '../utils/tripSchedule';

const PAGE_SIZE = 20;

const TripList: React.FC<{ trips: Trip[] }> = ({ trips }) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loader = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loader.current) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visibleCount < trips.length) {
        setVisibleCount(count => Math.min(count + PAGE_SIZE, trips.length));
      }
    });
    observer.observe(loader.current);
    return () => observer.disconnect();
  }, [visibleCount, trips.length]);

  return (
    <div style={{ margin: '16px 0' }}>
      <h3>All Trips</h3>
      <ul style={{ maxHeight: 300, overflowY: 'auto', padding: 0, margin: 0 }}>
        {trips.slice(0, visibleCount).map((trip, i) => (
          <li key={i} style={{ padding: 4, borderBottom: '1px solid #eee', listStyle: 'none' }}>
            {trip.start} - {trip.end}
          </li>
        ))}
      </ul>
      {visibleCount < trips.length && <div ref={loader} style={{ height: 24 }} />}
    </div>
  );
};

export default TripList;