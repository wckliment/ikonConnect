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
    const backToStartLink = document.getElementById('back-to-start');

    const confirmationStep = document.getElementById('confirmation-step');
    const submitBtn = document.querySelector('#patient-forms-step .submit-btn');

    // Store selected time globally
    let selectedTime = null;

    // Confirmation DOM fields
    const confirmName = document.getElementById('confirm-name');
    const confirmType = document.getElementById('confirm-type');
    const confirmDate = document.getElementById('confirm-date');
    const confirmTime = document.getElementById('confirm-time');
    const confirmPhone = document.getElementById('confirm-phone');
    const confirmEmail = document.getElementById('confirm-email');
    const confirmReason = document.getElementById('confirm-reason');

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
            selectedTime = button.previousElementSibling.textContent; // Save the selected time
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

    // ✅ Allow going back to Step 1
    backToStartLink.addEventListener('click', (e) => {
        e.preventDefault();
        appointmentForm.classList.add('hidden');
        stepOne.classList.remove('hidden');
    });

    // ✅ Submit forms and show confirmation screen
    submitBtn.addEventListener('click', () => {
        const name = document.getElementById('fullName').value;
        const rawType = document.getElementById('appointmentType').value;
        const type = rawType.charAt(0).toUpperCase() + rawType.slice(1);
        const date = document.getElementById('appointmentDate').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const reason = document.getElementById('reason').value || 'N/A';

        // Fill confirmation screen
        confirmName.textContent = name;
        confirmType.textContent = type;
        confirmDate.textContent = date;
        confirmTime.textContent = selectedTime || 'N/A';
        confirmPhone.textContent = phone;
        confirmEmail.textContent = email;
        confirmReason.textContent = reason;

        // Show confirmation screen
        formsStep.classList.add('hidden');
        confirmationStep.classList.remove('hidden');
    });
});
