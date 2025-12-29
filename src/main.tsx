import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./App.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import Join from "./pages/join/Join.tsx";
import Lobby from "./pages/lobby/Lobby.tsx";
import Meeting from "./pages/meeting/Meeting.js";
import { MeetingProvider } from "./hooks/context/MeetingContext.tsx";
import { AuthProvider } from "./hooks/context/AuthContext.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Dashboard />}/>
      <Route path="/join" element={<Join />}/>
      <Route path="lobby/:meetingId" element={<Lobby />} />
      <Route path="meeting/:meetingId" element={<Meeting />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <AuthProvider>
      <MeetingProvider>
        <RouterProvider router={router} />
      </MeetingProvider>
    </AuthProvider>
);
