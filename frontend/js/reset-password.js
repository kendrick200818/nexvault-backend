const BASE_URL = "https://nexvault-backend-production.up.railway.app";

const form = document.getElementById("resetPasswordForm");

// Pre-fill email from query string if present
const params = new URLSearchParams(window.location.search);
const emailParam = params.get("email");
if (emailParam) {
  const emailField = document.getElementById("email");
  if (emailField) emailField.value = emailParam;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const otp = document.getElementById("otp").value.trim();
  const newPassword = document.getElementById("newPassword").value;

  try {
    const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Password reset successfully! Please log in with your new password.");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Password reset failed. Please try again.");
    }
  } catch (error) {
    console.error("Reset password error:", error);
    alert("An error occurred. Please try again.");
  }
});
