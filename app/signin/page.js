// app/signin/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Container, TextField, Button, Typography } from "@mui/material";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // Navigate to the homepage or dashboard after signin
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoToSignUp = () => {
    router.push("/signup"); // Navigate to the Sign-Up page
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Sign In
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
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSignIn}
        style={{ marginTop: "20px" }}
      >
        Sign In
      </Button>
      <Button
        variant="text"
        color="secondary"
        fullWidth
        onClick={handleGoToSignUp}
        style={{ marginTop: "10px" }}
      >
        Don't have an account? Sign Up
      </Button>
    </Container>
  );
}
