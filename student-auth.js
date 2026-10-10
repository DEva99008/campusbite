'use strict';

const DATA_KEY = 'campusbite_simple_v1';
const SESSION_KEY = 'campusbite_student_session';
const form = document.getElementById('studentLoginForm');
const errorMessage = document.getElementById('studentLoginError');

form.addEventListener('submit', event => {
  event.preventDefault();
  errorMessage.textContent = '';
  let database;
  try {
    database = JSON.parse(localStorage.getItem(DATA_KEY) || '{}');
  } catch (error) {
    console.error('Could not read CampusBite student accounts:', error);
    errorMessage.textContent = 'Student account data could not be read in this browser.';
    return;
  }

  const id = document.getElementById('studentId').value.trim().toLowerCase();
  const pin = document.getElementById('studentPin').value.trim();
  const student = (Array.isArray(database.students) ? database.students : []).find(account =>
    String(account.id).toLowerCase() === id && account.role === 'Student'
  );
  if (!student || student.status !== 'Active') {
    errorMessage.textContent = 'We could not find an active student account with that ID.';
    return;
  }
  if (pin !== '1234') {
    errorMessage.textContent = 'Incorrect demo PIN. Use 1234 for local demo accounts.';
    return;
  }
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: student.id, signedInAt: new Date().toISOString() }));
    window.location.href = 'student.html';
  } catch (error) {
    console.error('Could not save the CampusBite student session:', error);
    errorMessage.textContent = 'Sign-in could not be saved. Check browser storage settings.';
  }
});
