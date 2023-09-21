"use client";
import { useState } from "react";
import { useAuth } from "../firebase/auth";
import Link from "next/link";
import ReusableDialog from "./reusableDialog";

export default function NavBar() {
    const { authUser, signOut } = useAuth();
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
    let greeting = "Hello, " + authUser?.email.split("@")[0] + "!";

    const handleLogoutConfirm = () => {
        signOut();
    }

    return (
        <div className="navbar-box">
            <div className="navbar-left">
                <Link href="/roster">Home</Link>
            </div>
            <div className="navbar-right">
                <p>{greeting}</p>
                <button className="navbarLogoutBtn" onClick={() => setOpenLogoutDialog(true)}>LOGOUT</button>
            </div>

            <ReusableDialog
                isOpen={openLogoutDialog}
                onClose={() => setOpenLogoutDialog(false)}
                title="LOGOUT"
                contentText={<span>Are you sure you want to logout?</span>}
                onConfirm={() => {
                    setOpenLogoutDialog(false);
                    handleLogoutConfirm();
                }}
                primaryButtonText="Logout"
                secondaryButtonText="Cancel"
            />

        </div>
    )
}