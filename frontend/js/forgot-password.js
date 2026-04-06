const BASE_URL = "https://nexvault-backend-production.up.railway.app";

const form = document.getElementById("forgotPasswordForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();

  try {
    const response = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("OTP sent to your email. Please check your inbox.");
      window.location.href = `reset-password.html?email=${encodeURIComponent(email)}`;
    } else {
      alert(data.message || "Failed to send OTP. Please try again.");
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    alert("An error occurred. Please try again.");
  }
});
