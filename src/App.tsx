import { Footer, GameBoard, Modals } from "@/components";
import { useSEOComponent } from "@/hooks";
import { Header } from "./components";

export const App: React.FC = () => {
  useSEOComponent();

  return (
    <div className="app">
      <Header />
      <GameBoard />
      <Footer />
      <Modals />
    </div>
  );
};
