import { Route, Routes } from "react-router-dom";
import "./App.css";
import AuthScreen from "./Pages/Auth";
import LogIn from "./Pages/Auth/login";
import CustomerManagement from "./Pages/Common/CustomerManagement";
import Dashboard from "./Pages/SuperUser/Dashboard";
import CreateScheme from "./Pages/SuperUser/CreateScheme";
import CustomerRegForm from "./Pages/Auth/CustomerRegForm";
import UserPrivateLayout from "../src/Apps/Layout/UserPrivateLayout";
import AuthLayoutWrapper from "./Apps/Layout/AuthLayoutWrapper";
import AgentManagement from "./Pages/Common/AgentManagement";
import SuperUserRegForm from "./Pages/Auth/SuperUserRegForm";
import AgentRegForm from "./Pages/Auth/AgentRegForm";
import InspectEditCustomerData from "./Pages/SuperUser/InspectEditCustomerData";
import InspectEditAgentData from "./Pages/SuperUser/InspectEditAgentData";
import PermissionManagement from "./Pages/SuperUser/PermissionManagement";
import PageNotFound from "./Pages/Common/PageNotFound";
import ManageScheme from "./Pages/Common/ManageScheme";
import EditSchemeData from "./Pages/SuperUser/EditSchemeData";
import SubscriptionManagement from "./Pages/SuperUser/SubscriptionManagement";
import CollectionEntryForm from "./Pages/Common/CollectionEntry";
import LeadCustomerForm from "./Pages/Agent/LeadCustomerForm";
import ManageCollections from "./Pages/Common/ManageCollections";
import AddCustNewScheme from "./Pages/Common/AddCustNewScheme";
import LeadcustManage from "./Pages/Agent/LeadcustManage";
import EditLeadCust from "./Pages/Agent/EditLeadCust";
import SuperUserManagement from "./Pages/SuperUser/BackOfficeManagement";
// import Bill from "./Pages/Customer/Bill";
import BranchAreaManagement from "./Pages/SuperUser/BranchAreaManagement";
import InspectSuperUser from "./Pages/SuperUser/InspectSuperUser";
import PassBookAssign from "./Pages/SuperUser/PassBookAssign";
import Notification from "./Pages/Notification/Notification";
import PrivateRoute from "./Apps/Layout/PrivateRoute";
import CustIndex from "./Pages/Customer/CustIndex";
import UseFetchLogger from "./Apps/CustomHook/UseFetchLogger";
import ManagePassBook from "./Pages/SuperUser/ManagePassBook";
import CustPaymentHistory from "./Pages/Customer/CustPaymentHistory";
import MonthlyPayment from "./Pages/Customer/MontlyPayment";
import EditCollection from "./Pages/SuperUser/EditCollection";
import EditSchemeReg from "./Pages/SuperUser/EditSchemeReg";
import ManageDesignation from "./Pages/SuperUser/ManageDesignation";
import PhoneNumber from "./Pages/Auth/PhoneNumber";
import Profile from "./Pages/AppBar/Profile";
import GenarateCertificate from "./Pages/SuperUser/GenerateCertificate";
import MaturityCertificateView from "./Pages/SuperUser/MaturityCertificateView";
import PerformanceReport from "./Pages/Agent/PerformanceReport";
import PurityMetalRateManagement from "./Pages/SuperUser/PurityMetalRateManagement";
import SchemeHistory from "./Pages/SuperUser/SchemeHistory";
import CollectionSummary from "./Pages/SuperUser/CollectionSummery";
import ViewLogs from "./Pages/SuperUser/ViewLogs";
function App() {
  const { global, AccessToken } = UseFetchLogger();

  return (
    <Routes>
      {/**auth routes */}
      <Route
        path="/"
        element={
          <AuthLayoutWrapper>
            <AuthScreen />
          </AuthLayoutWrapper>
        }
      >
        <Route index element={<LogIn />} />
        <Route path="phonenumber" element={<PhoneNumber />} />
      </Route>

      <Route
        path="/executive"
        element={<PrivateRoute authenticated={AccessToken} />}
      >
        <Route
          index
          element={
            <UserPrivateLayout>
              <Dashboard />
            </UserPrivateLayout>
          }
        />
        <Route
          path="profile"
          element={
            <UserPrivateLayout>
              <Profile />
            </UserPrivateLayout>
          }
        />
        <Route
          path="notifications"
          element={
            <UserPrivateLayout>
              <Notification />
            </UserPrivateLayout>
          }
        />
        <Route
          path="managesubscriptions"
          element={
            <UserPrivateLayout>
              <SubscriptionManagement />
            </UserPrivateLayout>
          }
        />
        <Route
          path="addcustscheme"
          element={
            <UserPrivateLayout>
              <AddCustNewScheme />
            </UserPrivateLayout>
          }
        />
        <Route
          path="collectionentry"
          element={
            <UserPrivateLayout>
              <CollectionEntryForm />
            </UserPrivateLayout>
          }
        />
        <Route
          path="customerregistration"
          element={
            <UserPrivateLayout>
              <CustomerRegForm />
            </UserPrivateLayout>
          }
        />
        <Route
          path="agentregistration"
          element={
            <UserPrivateLayout>
              <AgentRegForm />
            </UserPrivateLayout>
          }
        />
        <Route
          path="addleads"
          element={
            <UserPrivateLayout>
              <LeadCustomerForm />
            </UserPrivateLayout>
          }
        />{" "}
        <Route
          path="editleads"
          element={
            <UserPrivateLayout>
              <EditLeadCust />
            </UserPrivateLayout>
          }
        />
        <Route
          path="manageleads"
          element={
            <UserPrivateLayout>
              <LeadcustManage />
            </UserPrivateLayout>
          }
        />
        <Route
          path="managecollections"
          element={
            <UserPrivateLayout>
              <ManageCollections />
            </UserPrivateLayout>
          }
        />
      </Route>

      {/**superuser routes */}
      <Route
        path="/superuser"
        element={<PrivateRoute authenticated={AccessToken} />}
      >
        <Route
          path="logbooks"
          element={
            <UserPrivateLayout>
              <ViewLogs />
            </UserPrivateLayout>
          }
        />
        <Route
          path="purity-metal"
          element={
            <UserPrivateLayout>
              <PurityMetalRateManagement />
            </UserPrivateLayout>
          }
        />
        <Route
          path="collection-summary"
          element={
            <UserPrivateLayout>
              <CollectionSummary />
            </UserPrivateLayout>
          }
        />
        <Route
          path="managedesignation"
          element={
            <UserPrivateLayout>
              <ManageDesignation />
            </UserPrivateLayout>
          }
        />
        <Route
          path="generatecertificate"
          element={
            <UserPrivateLayout>
              <GenarateCertificate />
            </UserPrivateLayout>
          }
        />
        <Route
          path="viewcertificate"
          element={
            <UserPrivateLayout>
              <MaturityCertificateView />
            </UserPrivateLayout>
          }
        />
        <Route
          path="managepassbook"
          element={
            <UserPrivateLayout>
              <ManagePassBook />
            </UserPrivateLayout>
          }
        />
        <Route
          path="passbookassign"
          element={
            <UserPrivateLayout>
              <PassBookAssign />
            </UserPrivateLayout>
          }
        />
        <Route
          path="brancharea"
          element={
            <UserPrivateLayout>
              <BranchAreaManagement />
            </UserPrivateLayout>
          }
        />
        <Route
          path="vieweditsuperuser"
          element={
            <UserPrivateLayout>
              <InspectSuperUser />
            </UserPrivateLayout>
          }
        />
        <Route
          path="superusermanagement"
          element={
            <UserPrivateLayout>
              <SuperUserManagement />
            </UserPrivateLayout>
          }
        />
        <Route
          path="createscheme"
          element={
            <UserPrivateLayout>
              <CreateScheme />
            </UserPrivateLayout>
          }
        />
        <Route
          path="editscheme"
          element={
            <UserPrivateLayout>
              <EditSchemeData />
            </UserPrivateLayout>
          }
        />
        <Route
          path="customermanagement"
          element={
            <UserPrivateLayout>
              <CustomerManagement />
            </UserPrivateLayout>
          }
        />
        <Route
          path="superuserregistration"
          element={
            <UserPrivateLayout>
              <SuperUserRegForm />
            </UserPrivateLayout>
          }
        />
        <Route
          path="agentmanagement"
          element={
            <UserPrivateLayout>
              <AgentManagement />
            </UserPrivateLayout>
          }
        />
        <Route
          path="vieweditcustomer"
          element={
            <UserPrivateLayout>
              <InspectEditCustomerData />
            </UserPrivateLayout>
          }
        />
        <Route
          path="vieweditagent"
          element={
            <UserPrivateLayout>
              <InspectEditAgentData />
            </UserPrivateLayout>
          }
        />
        <Route
          path="managescheme"
          element={
            <UserPrivateLayout>
              <ManageScheme />
            </UserPrivateLayout>
          }
        />
        <Route
          path="scheme-history"
          element={
            <UserPrivateLayout>
              <SchemeHistory />
            </UserPrivateLayout>
          }
        />
        <Route
          path="permissionmanagement"
          element={
            <UserPrivateLayout>
              <PermissionManagement />
            </UserPrivateLayout>
          }
        />
        <Route
          path="editcollections"
          element={
            <UserPrivateLayout>
              <EditCollection />
            </UserPrivateLayout>
          }
        />
        <Route
          path="editcustscheme"
          element={
            <UserPrivateLayout>
              <EditSchemeReg />
            </UserPrivateLayout>
          }
        />
      </Route>

      {/**agent routes */}
      <Route
        path="/agent"
        element={<PrivateRoute authenticated={AccessToken} />}
      >
        <Route
          index
          element={
            <UserPrivateLayout>
              <PerformanceReport />
            </UserPrivateLayout>
          }
        />
      </Route>

      {/**customer routes */}
      <Route
        path="/customer"
        element={<PrivateRoute authenticated={AccessToken} />}
      >
        <Route
          index
          element={
            <UserPrivateLayout>
              <CustIndex />
            </UserPrivateLayout>
          }
        />
        <Route
          path="custpaymenthistory"
          element={
            <UserPrivateLayout>
              <CustPaymentHistory />
            </UserPrivateLayout>
          }
        />
        <Route
          path="monthlypayment"
          element={
            <UserPrivateLayout>
              <MonthlyPayment />
            </UserPrivateLayout>
          }
        />
       
      </Route>

      {/** Page not found */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
