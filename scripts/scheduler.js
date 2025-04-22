document.addEventListener('DOMContentLoaded', function () {
    const patientButtons = document.querySelectorAll('.patient-btn');
    const appointmentForm = document.getElementById('appointment-form-step');
    const stepOne = document.querySelector('.step-one');
    const appointmentDate = document.getElementById('appointmentDate');
    const timeSlots = document.getElementById('time-slots');
    const soonestCheckbox = document.getElementById('soonestCheckbox');
    const availableSlotInfo = document.getElementById('availableSlotInfo');

    const formsStep = document.getElementById('patient-forms-step');
    const backToTimeLink = document.getElementById('back-to-time');
    const confirmButtons = document.querySelectorAll('.confirm-btn');
    const backToStartLink = document.getElementById('back-to-start'); // ✅ still here

    // ✅ Show the form after selecting patient type
    patientButtons.forEach(button => {
        button.addEventListener('click', () => {
            stepOne.classList.add('hidden');
            appointmentForm.classList.remove('hidden');
        });
    });

    // ✅ Initialize flatpickr and store the instance
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
            flatpickrInstance.clear();
            flatpickrInstance.input.disabled = true;
            availableSlotInfo.textContent = 'Finding soonest available...';

            setTimeout(() => {
                availableSlotInfo.textContent = 'Soonest available: April 23, 2025 at 9:30 AM';
                timeSlots.classList.remove('hidden');
            }, 1000);
        } else {
            flatpickrInstance.input.disabled = false;
            availableSlotInfo.textContent = '';
            timeSlots.classList.add('hidden');
        }
    });

    // ✅ Move to Forms Screen when a time is confirmed
    confirmButtons.forEach(button => {
        button.addEventListener('click', () => {
            appointmentForm.classList.add('hidden');
            formsStep.classList.remove('hidden');
        });
    });

    // ✅ Allow going back to time selection
    backToTimeLink.addEventListener('click', (e) => {
        e.preventDefault();
        formsStep.classList.add('hidden');
        appointmentForm.classList.remove('hidden');
    });

    // ✅ FIXED: Allow going back to Step 1 ("Let's get started")
    backToStartLink.addEventListener('click', (e) => {
        e.preventDefault();
        appointmentForm.classList.add('hidden');
        stepOne.classList.remove('hidden');
    });
});
