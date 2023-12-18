import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     Element: <App />,
//     children: [
//       {
//         path: "",
//         element: <Header />,
//       },
//     ],
//   },
// ]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
