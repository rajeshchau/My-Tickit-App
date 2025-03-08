import React from 'react';
import { useQuery } from 'convex/react';
import { getValidTicketsForEvent } from '../../convex/tickets';
import { useAuth } from '@clerk/nextjs';

const YourTickets = () => {
  const { userId } = useAuth();
  const tickets = useQuery(getValidTicketsForEvent, { userId });







  return (
    <div>
      <h1>Your Tickets</h1>
      {tickets.length === 0 ? (
        <p>No tickets purchased yet.</p>
      ) : (
        <ul>
          {tickets.map((ticket: { id: string; event: { name: string; eventDate: number }; status: string; }) => (





            <li key={ticket.id}>
              <h2>{ticket.event.name}</h2>
              <p>Date: {new Date(ticket.event.eventDate).toLocaleDateString()}</p>
              <p>Status: {ticket.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default YourTickets;
