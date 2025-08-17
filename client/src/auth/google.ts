let _idToken: string | null = null;

declare global {
  interface Window {
    google?: any;
  }
}

export function initGoogleSignIn(onSignedIn: () => void) {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID; 
  if (!clientId) {
    console.warn("Missing REACT_APP_GOOGLE_CLIENT_ID");
    return;
  }

  // Wait until the GIS script is available
  const start = () => {
    window.google?.accounts.id.initialize({
      client_id: clientId,
      callback: (resp: any) => {
        _idToken = resp.credential; // JWT
        onSignedIn();
      },
    });

    // Render button into a container with this id
    window.google?.accounts.id.renderButton(
      document.getElementById("googleSignInBtn"),
      { theme: "outline", size: "large" }
    );
  };

  if (window.google?.accounts?.id) start();
  else {
    const timer = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(timer);
        start();
      }
    }, 100);
  }
}

export function getIdToken() {
  return _idToken;
}
