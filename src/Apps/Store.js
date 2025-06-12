import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

import AuthReducer from "../Slice/Auth/AuthSlice";
import ResetPassSlice from "../Slice/Auth/ResetPassSlice";
import CustomerRegSlice from "../Slice/Auth/CustomerRegSlice";
import AgentRegisterSlice from "../Slice/Auth/AgentRegisterSlice";
import TokenVarificationSlice from "../Slice/Auth/TokenVarificationSlice";

import ForgotPassSlice from "../Slice/Auth/ForgotPassSlice";
import SuperUserRegSlice from "../Slice/Auth/SuperUserRegSlice";

import CardsSlice from "../Slice/Dashboard/CardsSlice";
import BarChartsSlice from "../Slice/Dashboard/BarChart";
import PieChartSlice from "../Slice/Dashboard/PieChartSlice";
import LineChartSlice from "../Slice/Dashboard/LineChartSlice";
import DuePaymentsSlice from "../Slice/Dashboard/DuePaymentsSlice";
import AgentPerformanceSlice from "../Slice/Dashboard/AgentPerformanceSlice";
import DueLeadSlice from "../Slice/Dashboard/DueLeadSlice";
import AgentAreaCollSlice from "../Slice/Dashboard/AgentAreaCollSlice";
import SessionListSlice from "../Slice/Dashboard/SessionListSlice";

import UserListSlice from "../Slice/BackofficeUser/UserListSlice";
import CreateDesSlice from "../Slice/BackofficeUser/CreateDesSlice";
import SuperUserEditSlice from "../Slice/BackofficeUser/SuperUserEditSlice";
import SuperUserStatusSlice from "../Slice/BackofficeUser/SuperUserStatusSlice";
import DesignationListSlice from "../Slice/BackofficeUser/DesignationListSlice";
import SuperUserListSlice from "../Slice/BackofficeUser/BackofficeUserListSlice";
import  LogBookListSlice from "../Slice/BackofficeUser/LogListSlice";

import ListEditSlice from "../Slice/PortableCustomer/LeadEditSlice";
import LeadCustListSlice from "../Slice/PortableCustomer/PortableCustListSlice";
import PortableCustomerSlice from "../Slice/PortableCustomer/PortableCustomerSlice";

import CustomerListSlice from "../Slice/Customer/CustomerListSlice";
import CustomerEditSlice from "../Slice/Customer/CustomerEditSlice";
import CustomerSearchSlice from "../Slice/Customer/CustomerSearchSlice";
import ApprovedCustomerSlice from "../Slice/Customer/ApprovedCustomerSlice";
import CustomerStatusUpadateSlice from "../Slice/Customer/CutomerStatusUpdateSlice";
import CustomerTransferSlice from "../Slice/Customer/CustomerTransferSlice";

import MontlyPaymentSlice from "../Slice/PaymentDetails/MontlyPaymentSlice";
import WalletBalanceSlice from "../Slice/PaymentDetails/WalletBalanceSlice";
import PaymentDetailListSlice from "../Slice/PaymentDetails/PaymentDetailsSlice";
import PaymentStatusUpdateSlice from "../Slice/PaymentDetails/PaymentStatusUpdateSlice";
import PaymentHistorySlice from "../Slice/PaymentDetails/PaymentHistorySlice";

import AgentEditSlice from "../Slice/Agent/AgentEditSlice";
import AgentByIdSlice from "../Slice/Agent/AgentByIdSlice";
import AgentListSlice from "../Slice/Agent/AgentListSlice";
import AgentSearchSlice from "../Slice/Agent/AgentSearchSlice";
import AgentCodeListSlice from "../Slice/Agent/AgentCodeListSlice";
import AgentStatusUpdateSlice from "../Slice/Agent/AgentStatusUpdateSlice";

import AreaEditSlice from "../Slice/Area/AreaEditSlice";
import AreaListSlice from "../Slice/Area/AreaListSlice";
import AreaCreateSlice from "../Slice/Area/AreaCreateSlice";
import BranchListSlice from "../Slice/Area/BranchListSlice";
import AreaStatusSlice from "../Slice/Area/AreaStatusSlice";
import BranchEditSlice from "../Slice/Area/BranchEditSlice";
import BranchCreateSlice from "../Slice/Area/BranchCreateSlice";
import BranchStatusSlice from "../Slice/Area/BranchStatusSlice";

import ScannerSlicer from "../Slice/others/ScannerSlicer";

import PageAccessSlice from "../Slice/Page/PageAccessSlice";
import FindPageIdSlice from "../Slice/Page/FindPageIdSlice";
import PermissionAddSlice from "../Slice/Page/PermissionAddSlice";
import PermissionListSLice from "../Slice/Page/PagePermissionSlice";

import AddSchemeSlice from "../Slice/Scheme/AddSchemeSlice";
import SchemeListSlice from "../Slice/Scheme/SchemeListSlice";
import EditSchemeSlice from "../Slice/Scheme/EditSchemeSlice";
import EditNomineeSlice from "../Slice/Scheme/EditNomineeSlice";
import DeleteschemeSlice from "../Slice/Scheme/DeleteSchemeSlice";
import SearchSchemeSlice from "../Slice/Scheme/SchemeSearchSlice";
import CustAccDeleteSlice from "../Slice/Scheme/CustAccDeleteSlice";
import SchemeByCustIdSlice from "../Slice/Scheme/SchemebyCustIdSlice";
import SchemeStatusUpdateSlice from "../Slice/Scheme/SchemeStatusUpdateSlice";
import SchemeHistorySlice from "../Slice/Scheme/SchemeHistorySlice";

import CollectionListSlice from "../Slice/Collection/CollectionListSlice";
import CollectionEditSlice from "../Slice/Collection/CollectionEditSlice";
import CollectionEntrySlice from "../Slice/Collection/CollectionEntrySlice";
import DeleteCollectionSlice from "../Slice/Collection/DeleteCollectionSlice";
import LotListSlice from "../Slice/Collection/LotListSlice";
import LotEntryslice from "../Slice/Collection/LotEntrySlice";
import TotCollectionShowSlice from "../Slice/Collection/TotCollectionSlice";

import MCShowSlice from "../Slice/Collection/MCShowSlice";
import BonusUpdateSlice from "../Slice/Collection/BonusUpdateSlice";
import MultiSchemeAddSlice from "../Slice/Scheme/MultiSchemeAddSlice";
import MaturityUpdateSlice from "../Slice/Collection/MaturityUpdateSlice";
import MaturityCertificateCreateSlice from "../Slice/Collection/MaturityCertificateCreateSlice";

import CustPBSlice from "../Slice/PassBook/CustPBSlice";
import AgentPBSlice from "../Slice/PassBook/AgentPBSlice";
import CustPBReturnSlice from "../Slice/PassBook/CustPBReturnSlice";
import BackPBformAgentSlice from "../Slice/PassBook/BackPBfromAgent";
import PassBooKStockSlice from "../Slice/PassBook/PassBookStockSlice";
import AvailPassBookSlice from "../Slice/PassBook/AvailPassBookSlice";

import CustPBAssignSlice from "../Slice/PassBook/CustPBAssignSlice";
import AgentPBAssignSlice from "../Slice/PassBook/AgentPBAssignSlice";
import PassBookGenerateSlice from "../Slice/PassBook/PassBookGenerateSlice";

import branchTransferSlice from "../Slice/PassBook/BranchTransferSlice";
import SendNotificationSlice from "../Slice/Notification/SendNotificationSlice";
import ReadNotificationSlice from "../Slice/Notification/ReadNotificationSlice";
import NotificationListSlice from "../Slice/Notification/NotificationListSlice";
import NotificationHandlerSlice from "../Slice/others/NotificationHandlerSlice";

import AddPuritySlice from "../Slice/PurityVsRate/AddPuritySlice"; 
import PurityListSlice from "../Slice/PurityVsRate/PurityListSlice";
import  AddRateVsPuritySlice from "../Slice/PurityVsRate/AddRateVsPuritySlice";
import RateVsPuritySlice from "../Slice/PurityVsRate/RateVsPuritySlice";

const rootReducer = combineReducers({
  auth: AuthReducer,
  Scanner: ScannerSlicer,
  NotificationHandler: NotificationHandlerSlice,
  AgentReg: AgentRegisterSlice,
  AgentSearch: AgentSearchSlice,
  AgentList: AgentListSlice,
  CustomerReg: CustomerRegSlice,
  CustomerList: CustomerListSlice,
  CustomerSearch: CustomerSearchSlice,
  AreaList: AreaListSlice,
  AgentCodeList: AgentCodeListSlice,
  AgentStatus: AgentStatusUpdateSlice,
  CustStatus: CustomerStatusUpadateSlice,
  CustomerEdit: CustomerEditSlice,
  AgentEdit: AgentEditSlice,
  UserList: UserListSlice,
  Permission: PermissionListSLice,
  PermissionAdd: PermissionAddSlice,
  PageList: PageAccessSlice,
  addScheme: AddSchemeSlice,
  FindPageId: FindPageIdSlice,
  SchemeList: SchemeListSlice,
  EditScheme: EditSchemeSlice,
  SearchSchemeList: SearchSchemeSlice,
  SchemeStatusUpdate: SchemeStatusUpdateSlice,
  AgentById: AgentByIdSlice,
  CollectionList: CollectionListSlice,
  CollectionEntry: CollectionEntrySlice,
  leadCust: PortableCustomerSlice,
  leadCustList: LeadCustListSlice,
  SchemeListById: SchemeByCustIdSlice,
  ApprovedCustomer: ApprovedCustomerSlice,
  CustPayDetails: PaymentDetailListSlice,
  PayStatusUpdate: PaymentStatusUpdateSlice,
  MultiSchemeCust: MultiSchemeAddSlice,
  LeadEdit: ListEditSlice,
  maturity: MaturityUpdateSlice,
  bonus: BonusUpdateSlice,
  branch: BranchListSlice,
  superuser: SuperUserListSlice,
  superuserReg: SuperUserRegSlice,
  branchCreate: BranchCreateSlice,
  AreaCreate: AreaCreateSlice,
  branchStatus: BranchStatusSlice,
  AreaStatus: AreaStatusSlice,
  sss: SuperUserStatusSlice,
  SuperUserEdit: SuperUserEditSlice,
  EditArea: AreaEditSlice,
  EditBranch: BranchEditSlice,
  pbStock: PassBooKStockSlice,
  notify: NotificationListSlice,
  sendmsg: SendNotificationSlice,
  readmsg: ReadNotificationSlice,
  PBList: AvailPassBookSlice,
  custPB: CustPBSlice,
  agentPB: AgentPBSlice,
  CustPBAssign: CustPBAssignSlice,
  AgentPBAssign: AgentPBAssignSlice,
  PBGen: PassBookGenerateSlice,
  mp: MontlyPaymentSlice,
  Wb: WalletBalanceSlice,
  DesiList: DesignationListSlice,
  AgentPBreturn: BackPBformAgentSlice,
  EditCustSchemeReg: EditNomineeSlice,
  DelScheme: DeleteschemeSlice,
  branchTransferPB: branchTransferSlice,
  CollEdit: CollectionEditSlice,
  PBCustReturn: CustPBReturnSlice,
  CustAccDel: CustAccDeleteSlice,
  createDes: CreateDesSlice,
  resetPass: ResetPassSlice,
  forgetPass: ForgotPassSlice,
  McGen: MaturityCertificateCreateSlice,
  McShow: MCShowSlice,
  DashboardCards: CardsSlice,
  DuePay: DuePaymentsSlice,
  Line: LineChartSlice,
  Pie: PieChartSlice,
  Bar: BarChartsSlice,
  token: TokenVarificationSlice,
  session: SessionListSlice,
  AP: AgentPerformanceSlice,
  AgentAreaCol: AgentAreaCollSlice,
  dueleads: DueLeadSlice,
  DelColl: DeleteCollectionSlice,
  InserPurity: AddPuritySlice,
  puritylist: PurityListSlice,
  addpurityrate: AddRateVsPuritySlice,
  ratelist: RateVsPuritySlice,
  schemeHist: SchemeHistorySlice,
  alllots: LotListSlice,
  lotentry: LotEntryslice,
  logs: LogBookListSlice,
  totcol: TotCollectionShowSlice,
  custTrans: CustomerTransferSlice,
  payHist:PaymentHistorySlice,
});
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

export const persistor = persistStore(store);
