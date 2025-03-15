import { tool } from 'ai';
import { z } from 'zod';
import type { Geo } from '@vercel/functions';

export const datetime = (geo: Geo) =>
  tool({
    description: "Get the current date and time in the user's timezone",
    parameters: z.object({}),
    execute: async () => {
      try {
        // Get current date and time
        const now = new Date();

        // Use geolocation to determine timezone
        let userTimezone = 'UTC'; // Default to UTC

        if (geo?.latitude && geo.longitude) {
          try {
            // Get timezone from coordinates using Google Maps API
            const tzResponse = await fetch(
              `https://maps.googleapis.com/maps/api/timezone/json?location=${geo.latitude},${geo.longitude}&timestamp=${Math.floor(now.getTime() / 1000)}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
            );

            if (tzResponse.ok) {
              const tzData = await tzResponse.json();
              if (tzData.status === 'OK' && tzData.timeZoneId) {
                userTimezone = tzData.timeZoneId;
                console.log(
                  `Timezone determined from coordinates: ${userTimezone}`,
                );
              } else {
                console.log(
                  `Failed to get timezone from coordinates: ${tzData.status || 'Unknown error'}`,
                );
              }
            } else {
              console.log(
                `Timezone API request failed with status: ${tzResponse.status}`,
              );
            }
          } catch (error) {
            console.error('Error fetching timezone from coordinates:', error);
          }
        } else {
          console.log('No geolocation data available, using UTC');
        }

        // Format date and time using the timezone
        return {
          timestamp: now.getTime(),
          iso: now.toISOString(),
          timezone: userTimezone,
          formatted: {
            date: new Intl.DateTimeFormat('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: userTimezone,
            }).format(now),
            time: new Intl.DateTimeFormat('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
              timeZone: userTimezone,
            }).format(now),
            dateShort: new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              timeZone: userTimezone,
            }).format(now),
            timeShort: new Intl.DateTimeFormat('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
              timeZone: userTimezone,
            }).format(now),
          },
        };
      } catch (error) {
        console.error('Datetime error:', error);
        throw error;
      }
    },
  });
