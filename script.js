function getTimezoneOffsetForDate(date, timeZone) {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
    return (utcDate.getTime() - tzDate.getTime()) / 60000;
}

function isDST(date, timeZone) {
    const year = date.getFullYear();
    // A date in January (standard time for northern hemisphere)
    const jan = new Date(Date.UTC(year, 0, 1));
    // A date in June (daylight time for northern hemisphere)
    const jul = new Date(Date.UTC(year, 6, 1));

    const janOffset = getTimezoneOffsetForDate(jan, timeZone);
    const julOffset = getTimezoneOffsetForDate(jul, timeZone);

    // If offsets are the same, the zone doesn't observe DST
    if (janOffset === julOffset) {
        return false;
    }

    // Get current offset
    const currentOffset = getTimezoneOffsetForDate(date, timeZone);

    // DST is active if the current offset matches the "summer" offset, which has a smaller value.
    return currentOffset === Math.min(janOffset, julOffset);
}


document.addEventListener('DOMContentLoaded', () => {
    const clocks = document.querySelectorAll('.clock');

    function setDate() {
        const now = new Date();

        clocks.forEach(clock => {
            const timezone = clock.dataset.timezone;
            const timeOptions = {
                timeZone: timezone,
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: false
            };

            const formatter = new Intl.DateTimeFormat('en-US', timeOptions);
            const parts = formatter.formatToParts(now);

            let hour, minute, second;
            parts.forEach(part => {
                switch (part.type) {
                    case 'hour':
                        hour = parseInt(part.value, 10);
                        break;
                    case 'minute':
                        minute = parseInt(part.value, 10);
                        break;
                    case 'second':
                        second = parseInt(part.value, 10);
                        break;
                }
            });
            
            // In some cases, 'hour' can be 24 for midnight.
            if (hour === 24) {
                hour = 0;
            }

            const hourHand = clock.querySelector('.hour-hand');
            const minuteHand = clock.querySelector('.minute-hand');
            const secondHand = clock.querySelector('.second-hand');

            const secondsDegrees = (second / 60) * 360;
            const minutesDegrees = (minute / 60) * 360 + (second / 60) * 6;
            const hoursDegrees = (hour / 12) * 360 + (minute / 60) * 30;

            secondHand.style.transform = `translateX(-50%) rotate(${secondsDegrees}deg)`;
            minuteHand.style.transform = `translateX(-50%) rotate(${minutesDegrees}deg)`;
            hourHand.style.transform = `translateX(-50%) rotate(${hoursDegrees}deg)`;

            // AM/PM background color
            if (hour >= 6 && hour < 18) {
                clock.classList.add('am');
                clock.classList.remove('pm');
            } else {
                clock.classList.add('pm');
                clock.classList.remove('am');
            }

            // DST Check
            const cityNameElement = clock.nextElementSibling;
            const originalCityName = cityNameElement.dataset.originalName || cityNameElement.textContent;
            if (!cityNameElement.dataset.originalName) {
                cityNameElement.dataset.originalName = cityNameElement.textContent;
            }

            if (isDST(now, timezone)) {
                cityNameElement.innerHTML = `${originalCityName} <span class="dst">*</span>`;
            } else {
                cityNameElement.textContent = originalCityName;
            }
        });
    }

    setInterval(setDate, 1000);
    setDate(); // Initial call
});
