document.addEventListener('DOMContentLoaded', function () {
    const patientButtons = document.querySelectorAll('.patient-btn');
    const appointmentForm = document.getElementById('appointment-form-step');
    const stepOne = document.querySelector('.step-one');
    const appointmentDate = document.getElementById('appointmentDate');
    const timeSlots = document.getElementById('time-slots');

    // Show the form after selecting patient type
    patientButtons.forEach(button => {
        button.addEventListener('click', () => {
            stepOne.classList.add('hidden');
            appointmentForm.classList.remove('hidden');
        });
    });

    // Initialize Flatpickr
    flatpickr(appointmentDate, {
        minDate: 'today',
        dateFormat: 'm/d/Y',
        onChange: function(selectedDates, dateStr, instance) {
            // Show time slots once a date is picked
            if (dateStr) {
                timeSlots.classList.remove('hidden');
            }
        }
    });
});
