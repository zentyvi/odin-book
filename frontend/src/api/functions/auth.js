import { api_url } from "../config.js";

function saveToken(data) {
  const { token } = data;
  localStorage.setItem("token", token);
}

async function signUp(data) {
  const response = await fetch(`${api_url}/auth/sign-up`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok && response.status !== 400) {
    throw new Error("Sign up failed");
  }

  const result = await response.json();
  if (!result.errors) {
    saveToken(result);
  }
  return result;
}

async function logIn(data) {
  const response = await fetch(`${api_url}/auth/log-in`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok && response.status !== 400) {
    throw new Error("Log in failed");
  }

  const result = await response.json();
  if (!result.errors) {
    saveToken(result);
  }
  return result;
}

async function googleLogIn(credentialResponse) {
  const response = await fetch(`${api_url}/auth/log-in/google`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ token: credentialResponse.credential }),
  });

  if (!response.ok) {
    throw new Error("Failed to log in via Google");
  }

  const result = await response.json();
  saveToken(result);
  return result;
}

async function githubLogIn(code) {
  const response = await fetch(`${api_url}/auth/log-in/github`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error("Failed to log in via Github");
  }

  const result = await response.json();
  saveToken(result);
  return result;
}

export { signUp, logIn, googleLogIn, githubLogIn };
