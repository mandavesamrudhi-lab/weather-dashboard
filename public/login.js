document.addEventListener("DOMContentLoaded", function () {

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const loginBtn = document.getElementById("loginBtn");
    const message = document.getElementById("message");
    const rememberMe = document.getElementById("rememberMe");

    // Show / Hide Password
    togglePassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.textContent = "🙈";
        } else {
            passwordInput.type = "password";
            togglePassword.textContent = "👁️";
        }

    });

    // Remember Me
    const savedEmail = localStorage.getItem("rememberedEmail");

    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMe.checked = true;
    }

    // Login
    loginBtn.addEventListener("click", function () {

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (email === "" || password === "") {
            message.textContent = "Please enter email and password.";
            message.style.color = "red";
            return;
        }

        if (
            email === "admin@gmail.com" &&
            password === "admin123"
        ) {

            if (rememberMe.checked) {
                localStorage.setItem("rememberedEmail", email);
            } else {
                localStorage.removeItem("rememberedEmail");
            }

            message.textContent = "Login successful!";
            message.style.color = "green";

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 800);

        } else {

            message.textContent = "Invalid email or password.";
            message.style.color = "red";

        }

    });

    // Forgot Password
    const resetBtn = document.getElementById("resetBtn");
    const resetEmail = document.getElementById("resetEmail");
    const resetMessage = document.getElementById("resetMessage");

    resetBtn.addEventListener("click", function () {

        if (resetEmail.value.trim() === "") {
            resetMessage.textContent = "Please enter your email.";
            resetMessage.style.color = "red";
            return;
        }

        resetMessage.textContent = "Forgot password is working!";
        resetMessage.style.color = "green";

    });

});