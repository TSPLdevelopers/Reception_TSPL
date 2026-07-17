import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

const EntryPage = lazy(() => import("./pages/EntryPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const UserHistoryPage = lazy(() => import("./pages/UserHistoryPage"));

function PageLoader() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white font-sans text-brand">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand/15 border-t-brand" aria-label="Loading page" />
        </div>
    );
}

function App() {
    return (
        <div className="min-h-screen font-sans text-[#111827] antialiased">
            <BrowserRouter>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/entry/:category" element={<EntryPage />} />
                        <Route path="/admin-login" element={<AdminLogin />} />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute>
                                    <AdminPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/history/:phone"
                            element={
                                <ProtectedRoute>
                                    <UserHistoryPage />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </div>
    );
}

export default App;
