import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { LoginPage } from "./routers/LoginPage";
import { UserPage } from "./routers/UserPage";
import { AdminPage } from "./routers/AdminPage";
import { AddUserPage } from "./routers/AddUserPage";
import { DetailPage } from "./routers/DetailPage";
import { ErrorPage } from "./routers/ErrorPage";
import { DashBoardLayOuts } from "./layouts/LayOuts";
import { EditUserPage } from "./routers/EditPage";
import { Requesters } from "./routers/visitRequesters";
import { HousingDashBoard } from "./routers/DashBoardUseReducer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/housing" />,
  },
  {
    path: "/housing",
    element: <DashBoardLayOuts />,
    children: [
      {
        path: "/housing",
        element: <HousingDashBoard />,
      },
      {
        path: "/housing/login",
        element: <LoginPage />,
      },
      {
        path: "/housing/login/admin",
        element: <AdminPage />,
      },
      {
        path: "/housing/login/user/:userId",
        element: <UserPage />,
      },
      {
        path: "/housing/login/admin/addUser",
        element: <AddUserPage />,
      },
      {
        path: "/housing/login/admin/details/:userId",
        element: <DetailPage />,
      },
      {
        path: "/housing/login/admin/updateUser/:userId",
        element: <EditUserPage />,
      },
      {
        path: "/housing/visiters",
        element: <Requesters />,
      },
    ],
  },
  {
    path: "/*",
    element: <ErrorPage />,
  },
]);

export default function HousingApp() {
  return (
    <div>
      <RouterProvider router={router} />
      <ToastContainer />
      <Footer />
    </div>
  );
}
