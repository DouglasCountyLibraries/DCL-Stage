// JavaScript Document
        // Function to get the current day name
        function getDayName(dayNumber) {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return days[dayNumber];
        }

        // Function to format the current date and time
        function displayCurrentDateTime() {
            // Create a new Date object
            const now = new Date();

            // Extract the day, date, year, and month
            const dayName = getDayName(now.getDay());
            const date = now.getDate();
            const year = now.getFullYear();
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const monthName = monthNames[now.getMonth()];

            // Extract the hour, minute, and determine AM/PM
            let hour = now.getHours();
            const minute = now.getMinutes();
            const ampm = hour >= 12 ? 'PM' : 'AM';

            // Convert to 12-hour format and remove leading zero for single-digit hours
            hour = hour % 12;
            hour = hour ? hour : 12; // the hour '0' should be '12'
            const formattedHour = hour < 10 ? hour : hour.toString();
            const formattedMinute = minute.toString().padStart(2, '0');

            // Format the time with an AM/PM indicator
            const time = `${formattedHour}:${formattedMinute} ${ampm}`;

            // Format the date and time with month name before the date
            const formattedDateTime = `${dayName}, ${monthName} ${date}, ${year}, ${time}`;

            // Set the formatted date and time as the text content of the HTML element
            document.getElementById('dateTimeDisplay').textContent = formattedDateTime;
        }

        // Call the function to display the current date and time
        displayCurrentDateTime();

        // Update the date and time every minute
        setInterval(displayCurrentDateTime, 1000); // 1000 milliseconds = 1 second