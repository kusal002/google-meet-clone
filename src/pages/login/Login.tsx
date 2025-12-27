import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../hooks/firebase/Firebase";

const Login = () => {
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // user state updates automatically via AuthContext
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl w-80 text-center">
        <h1 className="text-white text-xl mb-6">Sign in to continue</h1>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-200"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
