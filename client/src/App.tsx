import FetchData from "./components/FetchData";
import { useTranslation } from "react-i18next";

function App() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === "en" ? "ja" : "en";
    i18n.changeLanguage(nextLang);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/AthletIQ_background_image-1.png)`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <button onClick={toggleLanguage} style={{ margin: "10px" }}>
        🌐 Switch to {i18n.language === "en" ? "日本語" : "English"}
      </button>
      <FetchData />
    </div>
  );
}

export default App;