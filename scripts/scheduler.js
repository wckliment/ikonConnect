document.addEventListener('DOMContentLoaded', function () {
  function getFormIdByName(name) {
    const formMap = {
      "Dental History": 18,
      "Email and SMS Communication Release": 17,
      "Authorizations and Acknowledgements": 15,
    };
    return formMap[name];
  }
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
  submitBtn.disabled = true; // Start disabled

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

  const requiredForms = [
    "Medical History",
    "Dental Insurance Secural/IAQ",
    "Registration/HIPAA Form2"
  ];

    // 🧠 Restore saved inputs
  document.getElementById('fullName').value = localStorage.getItem('form_fullName') || '';
  document.getElementById('phone').value = localStorage.getItem('form_phone') || '';
  document.getElementById('email').value = localStorage.getItem('form_email') || '';
  document.getElementById('reason').value = localStorage.getItem('form_reason') || '';
  if (document.getElementById('appointmentType'))
    document.getElementById('appointmentType').value = localStorage.getItem('form_appointmentType') || '';
  if (document.getElementById('appointmentDate'))
    document.getElementById('appointmentDate').value = localStorage.getItem('form_appointmentDate') || '';

  // 💾 Save inputs to localStorage
  document.getElementById('fullName').addEventListener('input', (e) => {
    localStorage.setItem('form_fullName', e.target.value);
  });
  document.getElementById('phone').addEventListener('input', (e) => {
    localStorage.setItem('form_phone', e.target.value);
  });
  document.getElementById('email').addEventListener('input', (e) => {
    localStorage.setItem('form_email', e.target.value);
  });
  document.getElementById('reason').addEventListener('input', (e) => {
    localStorage.setItem('form_reason', e.target.value);
  });
  document.getElementById('appointmentType')?.addEventListener('change', (e) => {
    localStorage.setItem('form_appointmentType', e.target.value);
  });
  document.getElementById('appointmentDate')?.addEventListener('change', (e) => {
    localStorage.setItem('form_appointmentDate', e.target.value);
  });

  function checkFormsCompleted() {
    const allDone = requiredForms.every(name => localStorage.getItem(`formCompleted_${name}`) === 'true');
    submitBtn.disabled = !allDone;
  }

  // Check every 2 seconds in case patient completes form in new tab
  setInterval(checkFormsCompleted, 2000);
  checkFormsCompleted(); // also run immediately

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

    axios.post('http://localhost:5000/api/appointment-requests', {
      name,
      dob: null,
      phone,
      email,
      appointment_type: typeText,
      preferred_time: date,
      notes: `${reason} | Preferred Time: ${selectedTime}`,
      patient_type: patientType
    }).then(response => {
      console.log('Appointment request submitted!', response.data);
    }).catch(err => {
      console.error('Error submitting appointment request:', err);
      alert("Something went wrong. Please try again.");
    });

    formsStep.classList.add('hidden');
    confirmationStep.classList.remove('hidden');
  });

  // ✅ FORM START BUTTON LOGIC
  const startButtons = document.querySelectorAll('.start-btn');

  // ✅ On page load, check which forms are already submitted
startButtons.forEach(button => {
  const formName = button.dataset.formName;
  const completedKey = `formCompleted_${formName}`;
  const isCompleted = localStorage.getItem(completedKey) === "true";

  if (isCompleted) {
    button.textContent = "✔ Submitted";
    button.disabled = true;
    button.classList.remove("bg-blue-600");
    button.classList.add("bg-green-600", "text-white", "cursor-default");
  }
});

  startButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const formName = button.dataset.formName;
      const patientName = document.getElementById('fullName').value;
      const phone = document.getElementById('phone').value;
      const email = document.getElementById('email').value;
      const reason = document.getElementById('reason').value || '';
      const appointmentType = document.getElementById('appointmentType')?.value || '';
      const appointmentDate = document.getElementById('appointmentDate')?.value || '';



     try {
  console.log({
    formName,
    patientMetadata: {
      name: patientName,
      phone,
      email,
      reason,
      appointmentType,
      appointmentDate
    }
  });

 const response = await axios.post('http://localhost:5000/api/custom-form-tokens/public-generate', {
  form_id: getFormIdByName(formName),
  method: "website",
   patient_id: null, // optionally set if you're matching a patient
  location_id: 6 ///make dynamic later if needed
});


const { token } = response.data;

// ✅ Construct the link directly to ikonPractice
const link = `http://localhost:5173/forms/custom/${token}`;

// ✅ Mark as not completed
localStorage.setItem(`formCompleted_${formName}`, "false");

// ✅ Open the form in a new tab
       window.open(link, "_blank");


      // Recheck button enable/disable state
      setTimeout(checkFormsCompleted, 500);

} catch (err) {
  console.error("Failed to launch form:", err);
  alert("This form is currently unavailable. Please contact the office.");
}

    });
  });
});
