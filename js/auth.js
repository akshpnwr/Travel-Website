import firebaseConfig from "./firebaseConfig.js";

// // Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth(app);

// sign in
const logInForm = document.querySelector('.login-form');

auth.onAuthStateChanged(user => {
    if (user) {
        window.location.href = '/admin.html';
    }
});

logInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(logInForm);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        console.log(email, password);
        await auth.signInWithEmailAndPassword(email, password);
        alert('Sign in successfully');
    } catch (error) {
        alert(error.message);
    }
});