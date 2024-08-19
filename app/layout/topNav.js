// app/layout/topNav.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

export default function TopNav() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/signin"); // Redirect to sign-in page after sign-out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {user ? (
          <>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Welcome, {user.displayName || user.email}
            </Typography>
            <Button color="inherit" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        ) : (
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Not Signed In
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}
