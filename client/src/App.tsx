import "./App.css";
import FetchData from "./components/FetchData";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { initGoogleSignIn, getIdToken } from "./auth/google";

function App() {
  const { i18n } = useTranslation();
  const [signedIn, setSignedIn] = useState(false);

  const languages = [
    { code: "en", label: "English" },
    { code: "ja", label: "日本語" },
  ];

  useEffect(() => {
    initGoogleSignIn(() => setSignedIn(true));
  }, []);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  const idToken = getIdToken();

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
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(4px)",
          borderBottom: "1px solid #ccc",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>AthletIQ</div>
        <select
          id="language-selector"
          value={i18n.language}
          onChange={handleLanguageChange}
          style={{ padding: "5px", borderRadius: "4px", fontSize: "1rem" }}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              🌐 {lang.label}
            </option>
          ))}
        </select>
      </nav>

      <main style={{ padding: "20px" }}>
        {!signedIn && (
          <div style={{ margin: "20px 0" }}>
            <div id="googleSignInBtn" />
          </div>
        )}

        {signedIn && (
          <FetchData idToken={idToken} />
        )}
      </main>
    </div>
  );
}

export default App;
