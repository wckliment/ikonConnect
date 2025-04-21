document.addEventListener('DOMContentLoaded', function () {
    const patientButtons = document.querySelectorAll('.patient-btn');
    const appointmentForm = document.getElementById('appointment-form-step');
    const stepOne = document.querySelector('.step-one');

    patientButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Hide step 1
            stepOne.classList.add('hidden');

            // Show step 2 (the form)
            appointmentForm.classList.remove('hidden');
        });
    });
});
