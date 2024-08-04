const form = document.getElementById('loginForm');
const message = document.getElementById('message');
let attempts = 0;
async function getter(e) {
 e.preventDefault();
 const username = document.getElementById("Nam").value;
 const password = document.getElementById("Pass").value;
 const rememberMe = document.getElementById("checker").checked;
 try {
 const response = await fetch('/login', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json'
 },
 body: JSON.stringify({ username, password, rememberMe })
 });
 if (response.ok) {
 const data = await response.json();
 if (data.success) {
 message.textContent = `Welcome, ${username}!`;
 } else {
 attempts++;
 if (attempts >= 3) {
 message.textContent = 'You are blocked';
 form.removeEventListener('submit', getter);
 } else {
 message.textContent = 'Invalid username or password';
 }
 }
 } else {
 throw new Error('Failed to login');
 }
 } catch (error) {
 console.error(error);
 message.textContent = 'An error occurred';
 }
};
form.addEventListener('submit', getter); 