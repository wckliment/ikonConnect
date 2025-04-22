document.addEventListener('DOMContentLoaded', function () {
    const patientButtons = document.querySelectorAll('.patient-btn');
    const appointmentForm = document.getElementById('appointment-form-step');
    const stepOne = document.querySelector('.step-one');
    const appointmentDate = document.getElementById('appointmentDate');
    const timeSlots = document.getElementById('time-slots');
    const soonestCheckbox = document.getElementById('soonestCheckbox');
    const availableSlotInfo = document.getElementById('availableSlotInfo');

    // Show the form after selecting patient type
    patientButtons.forEach(button => {
        button.addEventListener('click', () => {
            stepOne.classList.add('hidden');
            appointmentForm.classList.remove('hidden');
        });
    });

    // ✅ Save flatpickr instance
    const flatpickrInstance = flatpickr(appointmentDate, {
        minDate: 'today',
        dateFormat: 'm/d/Y',
        onChange: function (selectedDates, dateStr, instance) {
            if (dateStr) {
                timeSlots.classList.remove('hidden');
            }
        }
    });

    // ✅ Soonest available checkbox logic
    soonestCheckbox.addEventListener('change', function () {
        if (this.checked) {
            flatpickrInstance.clear();                   // Clear any selected date
            flatpickrInstance.input.disabled = true;     // Fully disable input
            availableSlotInfo.textContent = 'Finding soonest available...';

            // Simulate backend response
            setTimeout(() => {
                availableSlotInfo.textContent = 'Soonest available: April 23, 2025 at 9:30 AM';
                timeSlots.classList.remove('hidden');
            }, 1000);
        } else {
            flatpickrInstance.input.disabled = false;    // Re-enable input
            availableSlotInfo.textContent = '';
            timeSlots.classList.add('hidden');
        }
    });
});
