import { Footer, GameBoard, Modal } from "@/components";
import { useAppContext } from "@/context";
import { Header } from "./components";

export const App: React.FC = () => {
  const { isRulesModalVisible } = useAppContext();

  return (
    <div className="app">
      <Header />
      <GameBoard />
      <Footer />

      {isRulesModalVisible ? <Modal /> : null}
    </div>
  );
};
