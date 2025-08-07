import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//extensions
import App from "../App";
import Home from "../Components/Home";
import Login from "../Pages/Login";
import SignUp from "../Pages/SignUp";

//admin
import AdminDashboard from "../Pages/Admin/Dashboard";
import AdminContentModeration from "../Pages/Admin/ContentModeration";
import AdminModeratorManagement from "../Pages/Admin/ModeratorManagement";
import AdminSettings from "../Pages/Admin/Settings";

//birder
import BirderDashboard from "../Pages/Birder/Dashboard";
import BirderChecklists from "../Pages/Birder/Checklists";
import BirderBlog from "../Pages/Birder/Blog";
import BirderForum from "../Pages/Birder/Forum";
import BirderFollowers from "../Pages/Birder/Followers";
import BirderFollowing from "../Pages/Birder/Following";
import BirderSettings from "../Pages/Birder/Settings";
import BirderTrips from "../Pages/Birder/Trips";
import BirderNotifications from "../Pages/Birder/Notifications";
import BirderDiscussion from "../Pages/Birder/Discussion";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: "/login",
        element: <Login />,
      },

      {
        path: "/sign-up",
        element: <SignUp />,
      },

      //admin routes
      {
        path: "/admin",
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
        ],
      },

      //birder routes
      {
        path: "/birder",
        children: [
          {
            path: "dashboard",
            element: <BirderDashboard />,
          },

          {
            path: "blog",
            element: <BirderBlog />,
          },

          {
            path: "checklists",
            element: <BirderChecklists />,
          },

          {
            path: "trips",
            element: <BirderTrips />,
          },

          {
            path: "forum",
            element: <BirderForum />,
          },

          {
            path: "settings",
            element: <BirderSettings />,
          },

          {
            path: "blog",
            element: <BirderBlog />,
          },

          {
            path: "notifications",
            element: <BirderNotifications />,
          },

          // discussion/:id
          {
            path: "discussion",
            element: <BirderDiscussion />,
          }
        ],
      },

      
    ],
  },
]);

export default Router;
