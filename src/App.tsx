import { Footer, GameBoard, RulesModal, UsernameModal } from "@/components";
import { useAppContext } from "@/context";
import { useSEOComponent } from "@/hooks";
import { Header } from "./components";

export const App: React.FC = () => {
  useSEOComponent();

  const { isRulesModalVisible, isUsernameModalVisible } = useAppContext();

  return (
    <div className="app">
      <Header />
      <GameBoard />
      <Footer />

      {isUsernameModalVisible ? <UsernameModal /> : null}
      {isRulesModalVisible ? <RulesModal /> : null}
    </div>
  );
};
