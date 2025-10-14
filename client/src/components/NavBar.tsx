import React from "react";

interface NavBarProps {
  i18n: any;
  languages: { code: string; label: string }[];
  handleLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const NavBar: React.FC<NavBarProps> = ({ i18n, languages, handleLanguageChange }) => {
  return (
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontWeight: "bold",
          fontSize: "1.2rem",
        }}
      >
        <img
          src={`${process.env.PUBLIC_URL}/favicon-96x96.png`}
          alt="AthletIQ Logo"
          style={{
            width: "32px",
            height: "32px",
            marginRight: "8px",
            display: "block",
          }}
        />
        <span style={{ lineHeight: "1", display: "inline-block" }}>AthletIQ</span>
      </div>
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
  );
};

export default NavBar;
