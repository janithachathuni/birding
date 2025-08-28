import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//extensions
import App from "../App";
import Home from "../Components/Home";
import Error404 from "../Pages/Error404";
import Login from "../Pages/Login";
import SignUp from "../Pages/SignUp";
import ForgotPassword1 from "../Pages/ForgotPassword1";
import ForgotPassword2 from "../Pages/ForgotPassword2";

//general pages
import SingleBird from "../Pages/SingleBird";

//admin
import AdminDashboard from "../Pages/Admin/Dashboard";
import AdminContentModeration from "../Pages/Admin/ContentModeration";
import AdminModeratorManagement from "../Pages/Admin/ModeratorManagement";
import AdminSettings from "../Pages/Admin/Settings";
import AdminStatistics from "../Pages/Admin/Statistics";
import AdminAdvertisements from "../Pages/Admin/Advertisements";

// admin, bird data
import AdminBirdData from "../Pages/Admin/BirdData";
import AdminEditBirdData from "../Pages/Admin/EditBirdData";
import AdminAddNewBirdData from "../Pages/Admin/AddNewBirdData";

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

      {
        path: "/bird",
        element: <SingleBird />,
      },

      {
        path: "*", 
        element: <Error404 />,
      },

      {
        path: "/forgot-password-page1",
        element: <ForgotPassword1 />,
      },

      {
        path: "/forgot-password-page2",
        element: <ForgotPassword2 />,
      },

      //admin routes
      {
        path: "/admin",
        children: [
          {
            path: "content-moderation",
            element: <AdminContentModeration />,
          },

          {
            path: "manage-moderators",
            element: <AdminModeratorManagement />,
          },

          {
            path: "settings",
            element: <AdminSettings />,
          },

          {
            path: "dashboard",
            element: <AdminDashboard />,
          },

          {
            path: "statistics",
            element: <AdminStatistics />,
          },

          {
            path: "advertisements",
            element: <AdminAdvertisements />,
          },

          {
            path: "notifications",
            element: <AdminAdvertisements />,
          },

          {
            path: "bird-data",
            element: <AdminBirdData />,
          },

          {
            path: "edit-bird",
            element: <AdminEditBirdData />,
          },

          {
            path: "add-bird",
            element: <AdminAddNewBirdData />,
          }
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
