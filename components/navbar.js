"use client";
import { Button, Container, Typography, Box, Stack, AppBar } from "@mui/material";
import { useAuth } from "../firebase/auth";
import Link from "next/link";

export default function NavBar() {
    const { authUser, signOut } = useAuth();

    console.log("this is the authUser that shows in navBBar: ", authUser)
    let greeting = "Hello, " + authUser?.email.split("@")[0] + "!";

    return (
        <div className="navbar-box">
            <div className="navbar-left">
                <Link href="/">Home</Link>
            </div>
            <div className="navbar-right">
                <p>{greeting || "yerr"}</p>
                <button id="navbarLogoutBtn" onClick={signOut}>LOGOUT</button>
            </div>
        </div>
    )
}