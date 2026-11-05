document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".flip-card").forEach(function (card) {
        card.addEventListener("click", function () {
            var isFlipped = card.getAttribute("aria-pressed") === "true";
            card.setAttribute("aria-pressed", String(!isFlipped));
        });
    });

    var registerModal = document.getElementById("register-modal");
    var registerForm = document.getElementById("register-form");
    var loginModal = document.getElementById("login-modal");
    var loginForm = document.getElementById("login-form");
    var closeButtons = document.querySelectorAll(".modal-close");

    function openModal(modal) {
        if (modal) {
            modal.classList.add("show");
            modal.setAttribute("aria-hidden", "false");
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.classList.remove("show");
            modal.setAttribute("aria-hidden", "true");
        }
    }

    document.querySelectorAll(".nav-btn").forEach(function (button) {
        button.addEventListener("click", function () {
            var action = button.getAttribute("data-action");

            if (action === "login") {
                openModal(loginModal);
            } else if (action === "register") {
                openModal(registerModal);
            } else if (action === "logout") {
                var confirmLogout = confirm("Are you sure you want to log out?");
                if (confirmLogout) {
                    alert("You have been logged out successfully.");
                }
            }
        });
    });

    closeButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            var closeTarget = button.getAttribute("data-close");
            if (closeTarget === "login") {
                closeModal(loginModal);
            } else if (closeTarget === "register") {
                closeModal(registerModal);
            }
        });
    });

    [loginModal, registerModal].forEach(function (modal) {
        if (modal) {
            modal.addEventListener("click", function (event) {
                if (event.target === modal) {
                    closeModal(modal);
                }
            });
        }
    });

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            var fullNameInput = document.getElementById("full-name");
            var ageInput = document.getElementById("age");
            var phoneInput = document.getElementById("phone");
            var cityInput = document.getElementById("city");
            var emailInput = document.getElementById("email");
            var passwordInput = document.getElementById("password");

            var fullName = fullNameInput ? fullNameInput.value.trim() : "";
            var ageValue = ageInput ? ageInput.value.trim() : "";
            var phoneValue = phoneInput ? phoneInput.value.trim() : "";
            var cityValue = cityInput ? cityInput.value.trim() : "";
            var emailValue = emailInput ? emailInput.value.trim() : "";
            var passwordValue = passwordInput ? passwordInput.value.trim() : "";

            if (!fullName || !ageValue || !phoneValue || !cityValue || !emailValue || !passwordValue) {
                alert("Please fill in all fields before registering.");
                return;
            }

            var registeredUsers;
            try {
                var savedUsers = localStorage.getItem("cropcareUsers");
                registeredUsers = savedUsers ? JSON.parse(savedUsers) : [];

                if (!Array.isArray(registeredUsers)) {
                    throw new Error("Saved registration data is not in the expected format.");
                }
            } catch (error) {
                alert("Your information could not be loaded from this browser. Please try again.");
                return;
            }

            var emailAlreadyRegistered = registeredUsers.some(function (user) {
                return user && typeof user.email === "string" &&
                    user.email.toLowerCase() === emailValue.toLowerCase();
            });

            if (emailAlreadyRegistered) {
                alert("This email is already registered.");
                return;
            }

            registeredUsers.push({
                fullName: fullName,
                age: ageValue,
                phone: phoneValue,
                city: cityValue,
                email: emailValue
            });

            try {
                localStorage.setItem("cropcareUsers", JSON.stringify(registeredUsers));
            } catch (error) {
                alert("Your information could not be saved in this browser. Please try again.");
                return;
            }

            alert("Welcome, " + fullName + "! You are registered successfully from " + cityValue + ".");
            registerForm.reset();
            closeModal(registerModal);
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            var emailValue = document.getElementById("login-email").value.trim();
            var passwordValue = document.getElementById("login-password").value.trim();

            if (!emailValue || !passwordValue) {
                alert("Please enter your email and password.");
                return;
            }

            alert("Login successful. Welcome back!");
            loginForm.reset();
            closeModal(loginModal);
        });
    }

    var cropAnalysisForm = document.getElementById("crop-analysis-form");
    var cropAnalysisResult = document.getElementById("analysis-result");
    var imagePreviewBox = document.getElementById("image-preview");
    var photoInput = document.getElementById("leaf-photo");

    if (photoInput) {
        photoInput.addEventListener("change", function () {
            if (photoInput.files && photoInput.files.length > 0) {
                var file = photoInput.files[0];
                var previewUrl = URL.createObjectURL(file);

                if (imagePreviewBox) {
                    imagePreviewBox.innerHTML = "<img src='" + previewUrl + "' alt='Selected crop leaf preview'>";
                    imagePreviewBox.classList.add("show");
                }

                if (cropAnalysisResult) {
                    cropAnalysisResult.innerHTML = "<strong>Image Selected</strong><br>" +
                        "File ready for analysis: " + file.name;
                    cropAnalysisResult.classList.add("show");
                }
            }
        });
    }

    if (cropAnalysisForm) {
        cropAnalysisForm.addEventListener("submit", function (event) {
            event.preventDefault();

            var cropSelect = document.getElementById("crop");
            var cropName = cropSelect ? cropSelect.value : "";
            var selectedFile = photoInput && photoInput.files && photoInput.files.length > 0 ? photoInput.files[0] : null;

            if (!cropName) {
                if (cropAnalysisResult) {
                    cropAnalysisResult.innerHTML = "<strong>Select Crop</strong><br>Please choose a crop before analyzing.";
                    cropAnalysisResult.classList.add("show");
                }
                return;
            }

            var analysisMap = {
                tomato: {
                    health: "Healthy",
                    signs: "Leaf color is normal and no severe disease symptoms are visible.",
                    action: "Keep soil moisture balanced, remove damaged leaves, and monitor for early fungal stress or nutrient deficiency."
                },
                cotton: {
                    health: "Moderately Healthy",
                    signs: "Some leaf stress may be visible, especially around yellowing or pest damage.",
                    action: "Maintain proper watering, keep the field clean, and inspect for pest activity during the growing stage."
                },
                wheat: {
                    health: "Healthy Growth",
                    signs: "Crop appears stable with good leaf development and no major disease signs.",
                    action: "Continue regular field checks, ensure proper fertilization, and watch for fungal spots or weak stems."
                }
            };

            var result = analysisMap[cropName] || {
                health: "Healthy",
                signs: "No major symptoms detected in the uploaded leaf image.",
                action: "Continue regular field monitoring and keep crop care practices consistent."
            };

            if (cropAnalysisResult) {
                var fileText = selectedFile ? "<small>Uploaded file: " + selectedFile.name + "</small>" : "<small>No image uploaded.</small>";

                cropAnalysisResult.innerHTML =
                    "<strong>Crop Analysis Result</strong><br>" +
                    "Crop: " + cropName.charAt(0).toUpperCase() + cropName.slice(1) + "<br>" +
                    "Health Status: " + result.health + "<br>" +
                    "Visible Signs: " + result.signs + "<br>" +
                    "Recommended Action: " + result.action + "<br>" +
                    fileText;
                cropAnalysisResult.classList.add("show");
            }
        });
    }
});
