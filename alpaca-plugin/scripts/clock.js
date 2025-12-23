#!/usr/bin/env node

/**
 * Get market clock information
 * Usage: node clock.js
 */

const { getAlpacaClient } = require('./alpaca-client');

async function getClock() {
  const alpaca = getAlpacaClient();

  try {
    const clock = await alpaca.getClock();

    console.log('\n=== Market Clock ===\n');

    const now = new Date(clock.timestamp);
    console.log(`Current Time: ${now.toLocaleString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})`);

    if (clock.is_open) {
      console.log(`Market Status: OPEN`);
      const closeTime = new Date(clock.next_close);
      const timeToClose = closeTime - now;
      const hoursToClose = Math.floor(timeToClose / (1000 * 60 * 60));
      const minsToClose = Math.floor((timeToClose % (1000 * 60 * 60)) / (1000 * 60));
      console.log(`Closes: ${closeTime.toLocaleTimeString()} (in ${hoursToClose}h ${minsToClose}m)`);
    } else {
      console.log(`Market Status: CLOSED`);
      const openTime = new Date(clock.next_open);
      const timeToOpen = openTime - now;

      if (timeToOpen > 0) {
        const daysToOpen = Math.floor(timeToOpen / (1000 * 60 * 60 * 24));
        const hoursToOpen = Math.floor((timeToOpen % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minsToOpen = Math.floor((timeToOpen % (1000 * 60 * 60)) / (1000 * 60));

        if (daysToOpen > 0) {
          console.log(`Opens: ${openTime.toLocaleString()} (in ${daysToOpen}d ${hoursToOpen}h ${minsToOpen}m)`);
        } else {
          console.log(`Opens: ${openTime.toLocaleTimeString()} (in ${hoursToOpen}h ${minsToOpen}m)`);
        }
      }
    }

    // Get today's calendar
    const today = new Date().toISOString().split('T')[0];
    const calendar = await alpaca.getCalendar({ start: today, end: today });

    if (calendar.length > 0) {
      const day = calendar[0];
      console.log(`\n--- Today's Schedule (${day.date}) ---`);
      console.log(`Market Open: ${day.open}`);
      console.log(`Market Close: ${day.close}`);
    }

    return clock;
  } catch (error) {
    console.error('Error fetching market clock:', error.message);
    process.exit(1);
  }
}

getClock();
