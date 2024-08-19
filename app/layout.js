// app/layout.js
import TopNav from "./layout/topNav";
export const metadata = {
  title: "Flashcards App",
  description: "Your App Description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
