import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { AppLayout } from "@/components/layout/AppLayout";

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const ForgetPassPage = lazy(() => import("@/pages/auth/ForgetPassPage"));
const FirstAccessPage = lazy(() => import("@/pages/auth/FirstAccessPage"));

const HomePage = lazy(() => import("@/pages/app/HomePage"));
const CoursesPage = lazy(() => import("@/pages/app/CoursesPage"));
const CourseDetailPage = lazy(() => import("@/pages/app/CourseDetailPage"));
const MessagesPage = lazy(() => import("@/pages/app/MessagesPage"));
const NotificationsPage = lazy(() => import("@/pages/app/NotificationsPage"));
const ProfilePage = lazy(() => import("@/pages/app/ProfilePage"));
const TalksPage = lazy(() => import("@/pages/app/TalksPage"));
const CallConsultantPage = lazy(() => import("@/pages/app/CallConsultantPage"));
const ShopPage = lazy(() => import("@/pages/app/ShopPage"));
const RedirectPage = lazy(() => import("@/pages/app/RedirectPage"));
const ToolsPage = lazy(() => import("@/pages/app/ToolsPage"));

const AccountSettingsPage = lazy(
  () => import("@/pages/app/profile/AccountSettingsPage"),
);
const AddressPage = lazy(() => import("@/pages/app/profile/AddressPage"));
const PasswordPage = lazy(() => import("@/pages/app/profile/PasswordPage"));

const ToolDetailPage = lazy(() => import("@/pages/app/tools/ToolDetailPage"));
const ToolAnswerPage = lazy(() => import("@/pages/app/tools/ToolAnswerPage"));
const ToolSharePage = lazy(() => import("@/pages/app/tools/ToolSharePage"));
const SharedToolsPage = lazy(() => import("@/pages/app/tools/SharedToolsPage"));

const CoacheesPage = lazy(() => import("@/pages/app/coach/CoacheesPage"));

const CoachesPage = lazy(() => import("@/pages/app/coachee/CoachesPage"));

const ClassroomsPage = lazy(
  () => import("@/pages/app/customer/ClassroomsPage"),
);
const ClassroomDetailPage = lazy(
  () => import("@/pages/app/customer/ClassroomDetailPage"),
);
const OrdersPage = lazy(() => import("@/pages/app/customer/OrdersPage"));
const OrderDetailPage = lazy(
  () => import("@/pages/app/customer/OrderDetailPage"),
);
const ConfirmStudentPage = lazy(
  () => import("@/pages/app/customer/ConfirmStudentPage"),
);
const TransferTicketPage = lazy(
  () => import("@/pages/app/customer/TransferTicketPage"),
);
const VoucherPage = lazy(() => import("@/pages/app/customer/VoucherPage"));

export default function Router() {
  return (
    <HashRouter>
      <Suspense fallback={<Spinner fullScreen label="Carregando..." />}>
        <Routes>
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forget-pass" element={<ForgetPassPage />} />
            <Route path="first-access" element={<FirstAccessPage />} />
          </Route>

          <Route path="/app" element={<AppLayout />}>
            <Route path="home" element={<HomePage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/detail" element={<CourseDetailPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route
              path="profile/account-settings"
              element={<AccountSettingsPage />}
            />
            <Route path="profile/address" element={<AddressPage />} />
            <Route path="profile/password" element={<PasswordPage />} />
            <Route path="talks" element={<TalksPage />} />
            <Route path="call-consultant" element={<CallConsultantPage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route
              path="free-materials"
              element={
                <RedirectPage
                  title="Materiais gratuitos"
                  url="#/app/home"
                />
              }
            />
            <Route
              path="jrm"
              element={
                <RedirectPage
                  title="Frases da vida"
                  url="#/app/home"
                />
              }
            />
            <Route path="tools" element={<ToolsPage />} />
            <Route path="tools/detail" element={<ToolDetailPage />} />
            <Route path="tools/answer" element={<ToolAnswerPage />} />
            <Route path="tools/share" element={<ToolSharePage />} />
            <Route path="tools/shared" element={<SharedToolsPage />} />
            <Route path="coach/coachees" element={<CoacheesPage />} />
            <Route path="coachee/coaches" element={<CoachesPage />} />
            <Route path="customer/classrooms" element={<ClassroomsPage />} />
            <Route
              path="customer/classrooms/:id"
              element={<ClassroomDetailPage />}
            />
            <Route path="customer/orders" element={<OrdersPage />} />
            <Route path="customer/orders/:id" element={<OrderDetailPage />} />
            <Route
              path="customer/confirm/:studentId"
              element={<ConfirmStudentPage />}
            />
            <Route
              path="customer/transfer/:studentId"
              element={<TransferTicketPage />}
            />
            <Route path="customer/voucher" element={<VoucherPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
