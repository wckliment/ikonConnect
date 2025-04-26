document.addEventListener('DOMContentLoaded', function () {
    const patientButtons = document.querySelectorAll('.patient-btn');
    const appointmentForm = document.getElementById('appointment-form-step');
    const stepOne = document.querySelector('.step-one');
    const appointmentDate = document.getElementById('appointmentDate');
    const timeSlots = document.getElementById('time-slots');
    const soonestCheckbox = document.getElementById('soonestCheckbox');
    const availableSlotInfo = document.getElementById('availableSlotInfo');
    const formError = document.getElementById('formError');

    const formsStep = document.getElementById('patient-forms-step');
    const backToTimeLink = document.getElementById('back-to-time');
    const confirmButtons = document.querySelectorAll('.confirm-btn');
    const backToStartLink = document.getElementById('back-to-start');

    const confirmationStep = document.getElementById('confirmation-step');
    const submitBtn = document.querySelector('#patient-forms-step .submit-btn');

    const newOnlyFields = document.querySelectorAll('.new-only');
    const returningOnlyFields = document.querySelectorAll('.returning-only');

    let selectedTime = null;
    let patientType = null;

    const confirmName = document.getElementById('confirm-name');
    const confirmType = document.getElementById('confirm-type');
    const confirmDate = document.getElementById('confirm-date');
    const confirmTime = document.getElementById('confirm-time');
    const confirmPhone = document.getElementById('confirm-phone');
    const confirmEmail = document.getElementById('confirm-email');
    const confirmReason = document.getElementById('confirm-reason');

    // Show form after selecting patient type + toggle fields
    patientButtons.forEach(button => {
        button.addEventListener('click', () => {
            patientType = button.dataset.type;
            stepOne.classList.add('hidden');
            appointmentForm.classList.remove('hidden');

            if (patientType === 'new') {
                newOnlyFields.forEach(el => el.classList.remove('hidden'));
                returningOnlyFields.forEach(el => el.classList.add('hidden'));
            } else {
                newOnlyFields.forEach(el => el.classList.add('hidden'));
                returningOnlyFields.forEach(el => el.classList.remove('hidden'));
            }
        });
    });

    const flatpickrInstance = flatpickr(appointmentDate, {
        minDate: 'today',
        dateFormat: 'm/d/Y',
        onChange: function (selectedDates, dateStr) {
            if (dateStr) {
                timeSlots.classList.remove('hidden');
            }
        }
    });

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

    confirmButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = document.getElementById('fullName').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const date = document.getElementById('appointmentDate').value;
            const usingSoonest = soonestCheckbox.checked;

            let isValid = name && phone && email && (date || usingSoonest);

            if (patientType === 'new') {
                const type = document.getElementById('appointmentType').value;
                isValid = isValid && type;
            } else {
                const returningReason = document.getElementById('returningReason').value.trim();
                isValid = isValid && returningReason;
            }

            if (!isValid) {
                formError.classList.remove('hidden');
                return;
            }

            formError.classList.add('hidden');


            selectedTime = button.parentElement.querySelector('.time-label').textContent.trim();

            appointmentForm.classList.add('hidden');
            formsStep.classList.remove('hidden');
        });
    });

    backToTimeLink.addEventListener('click', (e) => {
        e.preventDefault();
        formsStep.classList.add('hidden');
        appointmentForm.classList.remove('hidden');
    });

    backToStartLink.addEventListener('click', (e) => {
        e.preventDefault();
        appointmentForm.classList.add('hidden');
        stepOne.classList.remove('hidden');
    });

    submitBtn.addEventListener('click', () => {
        const name = document.getElementById('fullName').value;
        const date = document.getElementById('appointmentDate').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const reason = document.getElementById('reason').value || 'N/A';

        let typeText = 'N/A';
        if (patientType === 'new') {
            const rawType = document.getElementById('appointmentType').value;
            typeText = rawType.charAt(0).toUpperCase() + rawType.slice(1);
        } else {
            typeText = document.getElementById('returningReason').value || 'Returning';
        }

        confirmName.textContent = name;
        confirmType.textContent = typeText;
        confirmDate.textContent = date;
        confirmTime.textContent = selectedTime || 'N/A';
        confirmPhone.textContent = phone;
        confirmEmail.textContent = email;
        confirmReason.textContent = reason;

          // POST to ikonPractice API
    axios.post('http://localhost:5000/api/appointment-requests', {
        name,
        dob: null, // Optional if you aren't collecting DOB
        phone,
        email,
        appointment_type: typeText,
        preferred_time: date,
        notes: `${reason} | Preferred Time: ${selectedTime}`, 
        patient_type: patientType
    }).then(response => {
        console.log('Appointment request submitted!', response.data);
        // Could show a success toast or animation here
    }).catch(err => {
        console.error('Error submitting appointment request:', err);
        alert("Something went wrong. Please try again.");
    });

    // Continue with confirmation screen
        formsStep.classList.add('hidden');
        confirmationStep.classList.remove('hidden');
    });
});
