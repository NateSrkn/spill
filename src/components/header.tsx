import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";
import { Button } from "./Button";
import { Coin } from "./Coin";

export default function Header() {
  const { theme, setTheme } = useTheme();
  return (
    <header className="flex flex-col md:sticky top-0">
      <div className="md:border-b md:border-[var(--outline)] bg-[var(--background-variant)] p-6">
        <nav className="flex justify-between max-w-[var(--max-width-body)] mx-auto">
          <div className="flex gap-2 items-center">
            <Coin size="24px" />
            <h1 className="subtext-header">Spill</h1>
            <div className="badge neutral">New</div>
          </div>
          <div>
            <Button
              intent="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <FiMoon size={24} /> : <FiSun size={24} />}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
