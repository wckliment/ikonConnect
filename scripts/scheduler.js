const formHTML = `
  <div class="form-row">
    <div class="form-wrapper">
      <form id="appointment-form">
        <label for="date">Preferred Date</label>
        <input type="text" id="date" name="date" placeholder="Select a date" />

        <label for="name">Full Name</label>
        <input type="text" id="name" name="name" />

        <label for="phone">Phone</label>
        <input type="tel" id="phone" name="phone" />

        <label for="email">Email</label>
        <input type="email" id="email" name="email" />

        <button type="submit">Request Appointment</button>
      </form>
    </div>

    <div id="time-slot-container" class="time-slots-wrapper">
      <!-- Time slots will go here -->
    </div>
  </div>
`;


// ✅ Inject form into .right-content, not .right-column
document.querySelector('.right-content').innerHTML = formHTML;

// Force style reflow
const formRow = document.querySelector('.form-row');
if (formRow) {
  formRow.style.display = 'flex';
}


// ✅ Calendar picker setup
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

    // Confirm button click handler
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

// ✅ Confirmation screen renderer
function showConfirmationScreen(dateStr, timeStr) {
  const confirmationHTML = `
    <div class="confirmation-screen">
      <h2>Review & Confirm</h2>
      <p><strong>Date:</strong> ${dateStr}</p>
      <p><strong>Time:</strong> ${timeStr}</p>
      <button id="submit-appointment" class="confirm-btn">Request Appointment</button>
    </div>
  `;
  // ✅ Replace only the right-content div
  document.querySelector('.right-content').innerHTML = confirmationHTML;
}
