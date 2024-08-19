"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../app/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  Container,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
  Fab,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getAnswerSuggestions } from "./services/ApiRequest";

export default function FlashcardManager() {
  const [user] = useAuthState(auth); // Get the authenticated user
  const router = useRouter();
  const [flashcards, setFlashcards] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [suggestedAnswer, setSuggestedAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to manage loading status

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const q = query(
            collection(db, "flashcards"),
            where("uid", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          setFlashcards(
            querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          );
        } catch (error) {
          console.error("Error fetching flashcards:", error);
        }
      }
    };
    fetchData();
  }, [user]); // Fetch flashcards whenever the user state changes

  const fetchSuggestedAnswer = async () => {
    if (newQuestion.trim()) {
      try {
        setIsLoading(true); // Start loading
        const aiGeneratedAnswer = await getAnswerSuggestions(newQuestion);
        setSuggestedAnswer(aiGeneratedAnswer);
      } catch (error) {
        console.error("Error fetching suggested answer:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
  };

  const addFlashcard = async () => {
    if (newQuestion.trim()) {
      try {
        await addDoc(collection(db, "flashcards"), {
          uid: user.uid, // Associate with the current user
          question: newQuestion,
          answer: newAnswer || suggestedAnswer, // Use AI-generated answer if user hasn't provided their own
          createdAt: new Date(),
        });
        setNewQuestion("");
        setNewAnswer("");
        setSuggestedAnswer("");
        const updatedSnapshot = await getDocs(
          query(collection(db, "flashcards"), where("uid", "==", user.uid))
        );
        setFlashcards(
          updatedSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
        setShowForm(false); // Hide form after adding a flashcard
      } catch (error) {
        console.error("Error adding flashcard:", error);
      }
    }
  };

  const deleteFlashcard = async (id) => {
    try {
      await deleteDoc(doc(db, "flashcards", id));
      setFlashcards(flashcards.filter((flashcard) => flashcard.id !== id));
    } catch (error) {
      console.error("Error deleting flashcard:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/signin"); // Redirect to sign-in page after sign-out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const filteredFlashcards = flashcards.filter((flashcard) =>
    flashcard.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {user && (
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Welcome, {user.displayName || user.email}
            </Typography>
            <Button color="inherit" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Toolbar>
        </AppBar>
      )}
      <Container style={{ paddingTop: "80px" }}>
        <TextField
          label="Search Flashcards"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Grid container spacing={2}>
          {filteredFlashcards.length > 0 ? (
            filteredFlashcards.map((flashcard) => (
              <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {flashcard.question}
                    </Typography>
                    <Typography variant="body1">{flashcard.answer}</Typography>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => deleteFlashcard(flashcard.id)}
                      disabled={!user} // Disable if the user is not authenticated
                      style={{ marginTop: "10px" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography
              variant="body1"
              color="textSecondary"
              style={{ padding: "20px" }}
            >
              No flashcards available
            </Typography>
          )}
        </Grid>
        {showForm && (
          <div style={{ marginTop: "20px" }}>
            <TextField
              label="New Question"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onBlur={fetchSuggestedAnswer} // Fetch suggestion when the user leaves the input field
            />
            {isLoading ? ( // Show loading spinner while fetching suggestion
              <Box mt={2} display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : (
              suggestedAnswer && (
                <Box mt={2}>
                  <Typography variant="h6">AI-Generated Suggestion</Typography>
                  <Typography variant="body1">{suggestedAnswer}</Typography>
                  <Divider style={{ margin: "10px 0" }} />
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setNewAnswer(suggestedAnswer)}
                  >
                    Use Suggested Answer
                  </Button>
                </Box>
              )
            )}
            <TextField
              label="New Answer (optional)"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              onKeyPress={(e) => (e.key === "Enter" ? addFlashcard() : null)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={addFlashcard}
              disabled={!user}
              fullWidth
              style={{ marginTop: "10px" }}
            >
              ADD NEW FLASHCARD
            </Button>
          </div>
        )}
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setShowForm(!showForm)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
          }}
        >
          <AddIcon />
        </Fab>
      </Container>
    </>
  );
}
