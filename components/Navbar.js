import Link from "next/link";
import { useRouter } from "next/router";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";

const Navbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-title">Calendar App</h1>
      <div className="navbar-buttons">
        <Link href="/calendar">
          <button className="nav-button">Kalendarz</button>
        </Link>
        <Link href="/about">
          <button className="nav-button">Opis</button>
        </Link>
        <button onClick={handleLogout} className="logout-button">Wyloguj</button>
      </div>
    </nav>
  );
};

export default Navbar;
