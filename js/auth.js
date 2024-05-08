const firebaseConfig = {
    apiKey: "AIzaSyC8zCEHAmKsmNyaqAFceeQx1wxURgphLm4",
    authDomain: "travel-website-5eae7.firebaseapp.com",
    projectId: "travel-website-5eae7",
    storageBucket: "travel-website-5eae7.appspot.com",
    messagingSenderId: "448643634931",
    appId: "1:448643634931:web:c117e915480ad67809c986",
    measurementId: "G-RRENEGB7YK",
};

// // Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth(app);

// sign in
const logInForm = document.querySelector('.login-form');

logInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(logInForm);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        console.log(email, password);
        await auth.signInWithEmailAndPassword(email, password);
        // alert('Sign in successfully');
        window.location.href = 'admin.html';
    } catch (error) {
        alert(error.message);
    }
});