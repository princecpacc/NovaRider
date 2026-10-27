import { Route, Routes } from "react-router-dom";


import Home from "./pages/Home";
import Login from "./pages/Login";
import UserSignUp from "./pages/user/UserSignup";
import UserProfile from "./pages/user/UserProfile";
import UserDashboard from "./pages/user/UserDashboard";
import CaptainSignup from "./pages/captain/CaptainSignup";
import CaptainProfile from "./pages/captain/CaptainProfile";
import CaptainDashboard from "./pages/captain/CaptainDashboard";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/users/signup" element={<UserSignUp />} />
      <Route path="/users/profile" element={<UserProfile />} />
      <Route path="/users/dashboard" element={<UserDashboard />} />

      <Route path="/captains/signup" element={<CaptainSignup />} />
      <Route path="/captains/profile" element={<CaptainProfile />} />
      <Route path="/captains/dashboard" element={<CaptainDashboard />}/>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}