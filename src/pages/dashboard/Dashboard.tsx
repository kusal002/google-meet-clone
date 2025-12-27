import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Join from "../join/Join";
import JoinMeetingDialog from "../../components/JoinMeetingDialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dialogVisible , setDialogVisible] = useState(false);

  return (
    <>
    <div className="relative min-h-screen overflow-hidden from-indigo-50 via-white to-purple-50 text-gray-800">
      
      {/* Abstract background shapes */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-300 opacity-30 blur-3xl"></div>
      <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-purple-300 opacity-30 blur-3xl"></div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Meetify
        </h1>
      </header>

      <main className="relative z-10 px-8 pt-12">
        {/* Intro */}
        <section className="max-w-3xl">
          <h2 className="text-4xl font-bold leading-tight">
            Seamless video meetings,
            <br /> built for focus.
          </h2>

          <p className="mt-3 text-lg text-gray-600">
            Connect, collaborate, and communicate effortlessly — all from your browser.
          </p>

          <p className="mt-4 text-gray-500 max-w-2xl">
            Meetify helps you start or join meetings instantly with a clean,
            distraction-free experience designed for modern teams and individuals.
          </p>
        </section>

        {/* Welcome */}
        <section className="mt-12">
          <h3 className="text-2xl font-semibold">
            Welcome back, <span className="text-indigo-600">Kusal</span> 👋
          </h3>
        </section>

        {/* Action tiles */}
        <section className="mt-8 grid gap-6 sm:grid-cols-2 max-w-3xl">
          
          {/* Join meeting */}
          <div
            className="group cursor-pointer rounded-2xl border border-gray-200 bg-white/70 p-6 backdrop-blur transition hover:shadow-lg"
          >
            <h4 className="text-xl font-semibold">Join a meeting</h4>
            <p className="mt-2 text-gray-600">
              Enter a meeting code and jump right in.
            </p>

            <div onClick={() => setDialogVisible(true)} className="mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-white transition group-hover:bg-indigo-700">
              Join now
            </div>
          </div>

          {/* Create meeting */}
          <div
            className="group cursor-pointer rounded-2xl border border-gray-200 bg-white/70 p-6 backdrop-blur transition hover:shadow-lg"
          >
            <h4 className="text-xl font-semibold">Create a meeting</h4>
            <p className="mt-2 text-gray-600">
              Start an instant meeting and invite others.
            </p>

            <div onClick={() => navigate("/lobby")} className="mt-6 inline-block rounded-lg bg-purple-600 px-4 py-2 text-white transition group-hover:bg-purple-700">
              Create now
            </div>
          </div>

        </section>
      </main>
    </div>
    <JoinMeetingDialog isOpen={dialogVisible} onClose={() => setDialogVisible(false)} />
    </>
  );
};

export default Dashboard;
