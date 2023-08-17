import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage } from "./Frontend/routers/LoginPage";
import { UserPage } from "./Frontend/routers/UserPage";
import { AdminPage } from "./Frontend/routers/AdminPage";
import { AddUserPage } from "./Frontend/routers/AddUserPage";
import { DetailPage } from "./Frontend/routers/DetailPage";
import { ErrorPage } from "./Frontend/routers/ErrorPage";
import { DashBoardLayOuts } from "./Frontend/layouts/LayOuts";
import { EditUserPage } from "./Frontend/routers/EditPage";
import { Requesters } from "./Frontend/routers/visitRequesters";
import { HousingDashBoard } from "./Frontend/routers/DashBoardUseReducer";

const router = createBrowserRouter([
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
    </div>
  );
}
