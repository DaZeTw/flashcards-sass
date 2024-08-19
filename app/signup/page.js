// app/signup/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Container, TextField, Button, Typography } from "@mui/material";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/"); // Navigate to the homepage or dashboard after signup
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoToSignIn = () => {
    router.push("/signin"); // Navigate to the Sign-In page
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Sign Up
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        label="Confirm Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSignUp}
        style={{ marginTop: "20px" }}
      >
        Sign Up
      </Button>
      <Button
        variant="text"
        color="secondary"
        fullWidth
        onClick={handleGoToSignIn}
        style={{ marginTop: "10px" }}
      >
        Already have an account? Sign In
      </Button>
    </Container>
  );
}
