import "./App.css";
import NavBar from "./components/NavBar";
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
        backgroundImage: `url(${process.env.PUBLIC_URL}/AthletIQ_background_image-2.png)`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <NavBar
        i18n={i18n}
        languages={languages}
        handleLanguageChange={handleLanguageChange}
      />

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
