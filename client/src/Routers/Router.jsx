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
import AllBirds from "../Pages/AllBirds";
import Family from "../Pages/Family";

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
import ProtectedRoute from "../Components/ProtectedRoute";

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

      //public bird data pages
      {
        path: "/bird/:id", // Updated to accept bird ID parameter
        element: <SingleBird />,
      },

      {
        path: "/all-birds",
        element: <AllBirds />,
      },

      {
        path: "/family/:familyName",
        element: <Family />,
      },

      //unauthorized, error 404s, forgot password pages
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
            element: (
              <ProtectedRoute requiredRole="admin">
                <AdminContentModeration/>
              </ProtectedRoute>
            )
          },

          {
            path: "manage-moderators",
            element: (
              <ProtectedRoute requiredRole="admin">
                <AdminModeratorManagement/>
              </ProtectedRoute>
            )
          },

          {
            path: "settings",
            element: (
              <ProtectedRoute requiredRole="admin">
                <AdminSettings/>
              </ProtectedRoute>
            )
          },

          {
            path: "dashboard",
            element: (
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard/>
              </ProtectedRoute>
            )
          },

          {
            path: "statistics",
            element: (
              <ProtectedRoute requiredRole="admin">
                <AdminStatistics/>
              </ProtectedRoute>
            )
          },

          {
            path: "advertisements",
            element: (
              <ProtectedRoute requiredRole="admin">
                <AdminAdvertisements/>
              </ProtectedRoute>
            )
          },

          //make notifications page!!!
          {
            path: "notifications",
            element: (
              <ProtectedRoute requiredRole="admin">
                <AdminContentModeration/>
              </ProtectedRoute>
            )
          },

          {
            path: "bird-data",
            element: (
              <ProtectedRoute requiredRole="admin">
                <AdminBirdData/>
              </ProtectedRoute>
            )
          },

          {
            path: "edit-bird/:id",
            element: (
              <ProtectedRoute requiredRole="admin">
                <AdminEditBirdData/>
              </ProtectedRoute>
            )
          },

          {
            path: "add-bird",
            element: (
              <ProtectedRoute requiredRole="admin">
                <AdminAddNewBirdData/>
              </ProtectedRoute>
            )
          }
        ],
      },

      //birder routes
      {
        path: "/birder",
        children: [
          {
            path: "dashboard",
            element: (
              <ProtectedRoute requiredRole="birder">
                <BirderDashboard/>
              </ProtectedRoute>
            )
          },

          {
            path: "checklists",
            element: (
              <ProtectedRoute requiredRole="birder">
                <BirderChecklists/>
              </ProtectedRoute>
            )
          },

          {
            path: "trips",
            element: (
              <ProtectedRoute requiredRole="birder">
                <BirderTrips/>
              </ProtectedRoute>
            )
          },

          {
            path: "forum",
            element: (
              <ProtectedRoute requiredRole="birder">
                <BirderForum/>
              </ProtectedRoute>
            )
          },

          {
            path: "settings",
            element: (
              <ProtectedRoute requiredRole="birder">
                <BirderSettings/>
              </ProtectedRoute>
            )
          },

          {
            path: "blog",
            element: (
              <ProtectedRoute requiredRole="birder">
                <BirderBlog/>
              </ProtectedRoute>
            )
          },

          {
            path: "notifications",
            element: (
              <ProtectedRoute requiredRole="birder">
                <BirderNotifications/>
              </ProtectedRoute>
            )
          },

          // discussion/:id
          {
            path: "discussion",
            element: (
              <ProtectedRoute requiredRole="birder">
                <BirderDiscussion/>
              </ProtectedRoute>
            )
          }
        ],
      },
    ],
  },
]);

export default Router;