import { useCallback, useState } from "react";

export default function CredentialForm({ onLogin, onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const toggleShowPass = useCallback(() => {
    setShowPass((oldShowPass) => !oldShowPass);
  }, []);

  return (
    <div className="form">
      <label>
        Username
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Password
        <input
          type={showPass ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span onClick={toggleShowPass}>
          {showPass ? "Hide" : "Show"} Password
        </span>
      </label>

      {/* <button onClick={() => onRegister({ username, password })}>
        Register
      </button> */}
      <button onClick={() => onLogin({ username, password })}>Login</button>
    </div>
  );
}
