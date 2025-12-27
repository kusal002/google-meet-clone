import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./hooks/context/AuthContext.tsx";
import Login from "./pages/login/Login.tsx";

function App() {
  const authContext = useContext(AuthContext);

  if (!authContext) return null;

  const { user, loading } = authContext;

  // 🔄 While Firebase checks auth state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  // 🔐 Not logged in
  if (!user) {
    return <Login />;
  }

  // ✅ Logged in
  return (
    <div className="App">
      <Outlet />
    </div>
  );
}

export default App;
