const formHTML = `
  <div class="form-row">
    <div class="form-wrapper">
      <form id="appointment-form">
        <label for="date">Preferred Date</label><br />
        <input type="text" id="date" name="date" placeholder="Select a date" /><br /><br />

        <label for="name">Full Name</label><br />
        <input type="text" id="name" name="name" /><br /><br />

        <label for="phone">Phone</label><br />
        <input type="tel" id="phone" name="phone" /><br /><br />

        <label for="email">Email</label><br />
        <input type="email" id="email" name="email" /><br /><br />

        <button type="submit">Request Appointment</button>
      </form>
    </div>

    <div id="time-slot-container" class="time-slots-wrapper">
      <!-- Time slots will be injected here -->
    </div>
  </div>
`;

document.querySelector('.right-column').innerHTML = formHTML;

flatpickr("#date", {
  minDate: "today",
  dateFormat: "m/d/Y",
  onChange: function (selectedDates, dateStr) {
    const times = ["10:00am", "11:00am", "1:00pm", "2:30pm", "4:00pm"];

    const timeSlotHTML = `
      <h3>Select a Time</h3>
      <div class="time-slots">
        ${times
          .map(
            (time) => `
              <div class="time-slot" data-time="${time}">
                <div class="time-label">${time}</div>
                <button class="confirm-btn">Confirm</button>
              </div>
            `
          )
          .join("")}
      </div>
    `;

    document.querySelector('#time-slot-container').innerHTML = timeSlotHTML;

    // Attach event listeners to each Confirm button
    document.querySelectorAll('.confirm-btn').forEach((button) => {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const selectedTime = this.parentElement.dataset.time;
       showConfirmationScreen(dateStr, selectedTime);
      });
    });
  }
});

function showConfirmationScreen(dateStr, timeStr) {
  const confirmationHTML = `
    <div class="confirmation-screen">
      <h2>Review & Confirm</h2>
      <p><strong>Date:</strong> ${dateStr}</p>
      <p><strong>Time:</strong> ${timeStr}</p>
      <button id="submit-appointment">Request Appointment</button>
    </div>
  `;
  document.querySelector('.right-column').innerHTML = confirmationHTML;
}
