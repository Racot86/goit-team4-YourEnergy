import axios from "axios";
// import Notiflix from 'notiflix';
// залишаю пок що через  alert, узгодимо бібліотеку буду доробляти
import {subscriptionRequest} from './api-service';


const form = document.querySelector('.subscribe-form');
const emailInput = form.elements.email;

let formData = { email: "" };
const STORAGE_KEY = 'subscribe-form-state';

const saveToLocalStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
};

const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        formData = JSON.parse(savedData);
        emailInput.value = formData.email || '';
    }
};

loadFromLocalStorage();

form.addEventListener('input', (event) => {
    const { name, value } = event.target;
    formData[name] = value.trim();
    saveToLocalStorage();
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!emailInput.validity.valid) {
        alert('Please enter a valid email');
        return;
    }

    formData.email = emailInput.value.trim();

    try {
        const response = await axios.post(subscriptionRequest(), formData);

        if (response.data.error) {
            if (response.status === 409) {
                alert('This email is already subscribed.');
            } else {
                alert('Subscription failed. Please try again later.');
            }
        } else {
            alert('Subscription successful!');
        }
    } catch (error) {
        if (error.response && error.response.status === 409) {
            alert('This email is already subscribed.');
        } else {
            alert('Subscription failed. Please try again later.');
        }
    }

    form.reset();
    localStorage.removeItem(STORAGE_KEY);
});
