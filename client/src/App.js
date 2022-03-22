import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/navigation";
import StartingPage from "./pages/StartingPage";
import SinglePost from "./components/SinglePost/SinglePost";
import PostForm from "./components/PostFrom/PostForm";
function App() {
  return (
    <div className="font-Mon w-full h-auto min-h-full relative">
      <Nav />
      <Routes>
        <Route path="/" exact element={<Login />} />
        <Route path="/register" exact element={<Register />} />
        <Route path="/startpage" exact element={<StartingPage />} />
        <Route path="postform" exact element={<PostForm />} />
        <Route path="/post/:postId" exact element={<SinglePost />} />
      </Routes>
    </div>
  );
}

export default App;
