export type Trip = { start: string; end: string };

function pad(n: number) {
  return n < 10 ? '0' + n : n.toString();
}

export function generateTrips(
  firstDeparture: string, // '05:30'
  frequency: number,      // in minutes
  duration: number        // in minutes
): Trip[] {
  const trips: Trip[] = [];
  const [startHour, startMin] = firstDeparture.split(':').map(Number);
  let current = new Date(0, 0, 0, startHour, startMin);
  const endOfDay = new Date(0, 0, 0, 22, 0); // 22:00

  while (current <= endOfDay) {
    const tripStart = new Date(current);
    const tripEnd = new Date(tripStart.getTime() + duration * 60000);
    trips.push({
      start: pad(tripStart.getHours()) + ':' + pad(tripStart.getMinutes()),
      end: pad(tripEnd.getHours()) + ':' + pad(tripEnd.getMinutes()),
    });
    current = new Date(current.getTime() + frequency * 60000);
  }
  return trips;
}