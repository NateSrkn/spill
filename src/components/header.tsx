import { useTheme } from "next-themes";
import { Coin } from "./Coin";

export default function Header() {
  const { theme, setTheme } = useTheme();
  return (
    <header className="text-center flex flex-col items-center gap-4 py-8">
      <button onClick={() => setTheme("light")}>light</button>
      <button onClick={() => setTheme("dark")}>dark</button>
      <Coin />
      <h2 className="main-header">Introducing Spill</h2>
      <p className="text">
        Spill is the easiest way to <br /> split the bill with your friends
      </p>
    </header>
  );
}
