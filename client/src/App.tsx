import "./App.css";
import NavBar from "./components/NavBar";
import FetchData from "./components/FetchData";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { initGoogleSignIn, getIdToken } from "./auth/google";

function App() {
  const { i18n } = useTranslation();
  const [signedIn, setSignedIn] = useState(false);
  const [guestMode, setGuestMode] = useState(false);

  const languages = [
    { code: "en", label: "English" },
    { code: "ja", label: "日本語" },
  ];

  useEffect(() => {
    initGoogleSignIn(() => {
      setSignedIn(true);
      setGuestMode(false);
    });
  }, []);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  const idToken = getIdToken();

  const handleGuestLogin = () => {
    setGuestMode(true);
    setSignedIn(false);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/AthletIQ_background_image-2a.png)`,
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
        {!signedIn && !guestMode && (
          <div style={{ margin: "20px 0" }}>
            <div id="googleSignInBtn" />
            <button onClick={handleGuestLogin} style={{ marginTop: "12px" }}>
              Log in as guest
            </button>
          </div>
        )}

        {signedIn && (
          <FetchData idToken={idToken} guestMode={false} />
        )}

        {guestMode && (
          <FetchData idToken={null} guestMode={true} />
        )}
      </main>
    </div>
  );
}

export default App;
