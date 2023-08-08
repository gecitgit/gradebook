"use client";
import { Button, Container, Typography, Box, Stack, AppBar } from "@mui/material";
import { useAuth } from "../firebase/auth";
import Link from "next/link";

export default function NavBar() {
    const { authUser, signOut } = useAuth();

    return (
        <div className="navbar-box">
            <div className="navbar-left">
                <Link href="/">Home</Link>
            </div>
            <div className="navbar-right">
                <p>{authUser?.email}</p>
                <button onClick={signOut}>logout</button>
            </div>
        </div>
    )
}