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
        });
    }

    setInterval(setDate, 1000);
    setDate(); // Initial call
});
