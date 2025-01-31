import Link from "next/link";
import '../styles/globals.css';
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <h1>Witamy w Calendar App</h1>
      <p>Aplikacja kalendarzowa do planowania zadań</p>
      <Link href="/login">
        <button>Zaloguj się</button>
      </Link>
    </div>
  );
}
