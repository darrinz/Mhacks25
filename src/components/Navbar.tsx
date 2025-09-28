// app/components/Navbar.tsx
"use client";

import * as React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import { createBrowserClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

type User = { name: string; avatarUrl?: string };

type NavbarProps = {
  isAuthenticated?: boolean;
  user?: User;
  onLogin?: () => void;
  onLogout?: () => void;
};

export default function Navbar({
  isAuthenticated,
  user,
  onLogin,
  onLogout,
}: NavbarProps) {
  const theme = useTheme();

  // fallback cookie check (placeholder)
  const [cookieAuthed, setCookieAuthed] = React.useState(false);
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const authed = /(?:^|;\s*)smoothie_auth=1(?:;|$)/.test(document.cookie);
    setCookieAuthed(authed);
  }, []);
  const authed = isAuthenticated ?? cookieAuthed;

  // avatar menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const initials =
    user?.name?.split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase() || "U";

    const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`, // Redirect to the callback route
      },
    });

    if (data.url) {
      return NextResponse.redirect(data.url);
    }

    if (error) {
      console.error("Error logging in with Google:", error.message);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log("User created at:", user?.created_at);
    console.log("User last sign-in at:", user?.last_sign_in_at);

    console.log("Google login response:", data);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      color="transparent"
      sx={{
        bgcolor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        mb:10
      }}
    >
      <Toolbar sx={{ minHeight: 64, px: { xs: 2, md: 3 } }}>
        {/* Brand */}
        <Typography
          variant="h6"
          component="a"
          href="/"
          sx={{
            textDecoration: "none",
            fontWeight: 700,
            letterSpacing: 0.2,
            color: theme.palette.text.primary,
            transition: "color .15s ease",
            "&:hover": { color: theme.palette.primary.main },
          }}
        >
          Smoothie
        </Typography>

        {/* Right */}
        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
          {!authed ? (
            <>
              <Button variant="text" color="inherit" onClick={onLogin} sx={{ px: 2 }}>
                Log in
              </Button>
              <Button
                variant="contained"

                onClick={handleGoogleLogin}
                sx={{
                  px: 2.5,
                  borderRadius: theme.shape.borderRadius,
                  boxShadow: "none",
                }}
              >
                Sign up
              </Button>
            </>
          ) : (
            <>
              <IconButton
                onClick={handleOpen}
                size="small"
                sx={{ ml: 1 }}
                aria-controls={open ? "profile-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                {user?.avatarUrl ? (
                  <Avatar
                    src={user.avatarUrl}
                    alt={user.name}
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: theme.palette.primary.light,
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.getContrastText(theme.palette.primary.main),
                      fontSize: 14,
                    }}
                  >
                    {initials}
                  </Avatar>
                )}
              </IconButton>

              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    borderRadius: theme.shape.borderRadius,
                    boxShadow: theme.shadows[3],
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle2" color="text.primary">
                    {user?.name ?? "User"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Auth cookie: {cookieAuthed ? "present" : "missing"}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem
                  onClick={onLogout}
                  sx={{
                    color: theme.palette.error.main,
                    "&:hover": { bgcolor: theme.palette.error.main + "14" }, // alpha
                  }}
                >
                  Log out
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
