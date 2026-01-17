const API = "/api";

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const regName = document.getElementById("regName");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const regRole = document.getElementById("regRole");

// Map frontend role values to backend role values
const roleMap = {
  "PUTNIK": "user",
  "OPERATOR": "admin",
  "OPERATER": "admin"  // Also handle OPERATER if that's what you use
};

if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      alert("Login form elements not found!");
      return;
    }

    try {
      const res = await fetch(`${API}/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: loginEmail.value,
          password: loginPassword.value
        })
      });

      if (res.ok) {
        window.location.href = "/travels.html";
      } else {
        const error = await res.json().catch(() => ({ message: "Login failed" }));
        alert(`Login failed: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed: Network error");
    }
  });
}

if (document.getElementById("registerForm")) {
  document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!regName || !regEmail || !regPassword || !regRole) {
      alert("Register form elements not found!");
      return;
    }

    try {
      // Map role from frontend value to backend value
      const backendRole = roleMap[regRole.value] || "user";

      const requestBody = {
        firstName: regName.value,
        email: regEmail.value,
        password: regPassword.value,
        role: backendRole
      };

      console.log("Sending registration request:", { ...requestBody, password: "***" });

      const res = await fetch(`${API}/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody)
      });

      console.log("Response status:", res.status, res.statusText);

      // Read response body first
      const responseData = await res.json().catch(async () => {
        const text = await res.text();
        console.error("Failed to parse JSON response:", text);
        return { message: `Server error: ${res.status} ${res.statusText}` };
      });

      console.log("Response data:", responseData);

      if (!res.ok) {
        // Show detailed error message
        const errorMsg = responseData.message || responseData.errors?.join(", ") || `Registration failed with status ${res.status}`;
        alert(`Registration failed: ${errorMsg}`);
        console.error("Registration failed:", responseData);
        return;
      }

      // Success
      alert(`Registration successful! ${responseData.message || "Now login."}`);
      console.log("Registration successful:", responseData);
      
      // Clear form
      regName.value = "";
      regEmail.value = "";
      regPassword.value = "";
      regRole.value = "PUTNIK";
    } catch (error) {
      console.error("Registration error:", error);
      alert(`Registration failed: ${error.message || "Network error"}`);
    }
  });
}
