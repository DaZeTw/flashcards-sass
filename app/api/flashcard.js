// app/api/flashcards.js
import { db } from "../../lib/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default async function handler(req, res) {
  const { method } = req;
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (method === "POST") {
    try {
      const { question, answer } = req.body;
      const docRef = await addDoc(collection(db, "flashcards"), {
        uid: user.uid,
        question,
        answer,
        createdAt: new Date(),
      });
      res.status(201).json({ id: docRef.id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (method === "GET") {
    try {
      const q = query(
        collection(db, "flashcards"),
        where("uid", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const flashcards = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.status(200).json(flashcards);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
