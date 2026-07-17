import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";

function ProtectedRoute({ children }) {
    const [status, setStatus] = useState("checking");

    useEffect(() => {
        let active = true;

        api.get("/admin/session")
            .then(() => {
                if (active) setStatus("authenticated");
            })
            .catch(() => {
                if (active) setStatus("unauthenticated");
            });

        return () => {
            active = false;
        };
    }, []);

    if (status === "checking") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-page-soft font-[Inter,Arial,sans-serif] text-brand">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#f3dce9] border-t-brand" />
                    <p className="mt-4 text-sm font-bold">Checking secure admin session...</p>
                </div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return <Navigate to="/admin-login" replace />;
    }

    return children;
}

export default ProtectedRoute;
