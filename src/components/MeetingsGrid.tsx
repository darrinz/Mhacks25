"use client";

import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

type MeetingsGridProps = {
  children: React.ReactNode;
  gap?: number;
};

export default function MeetingsGrid({ children, gap = 2 }: MeetingsGridProps) {
  return (
    <Box sx={{ width: '100%', py: 2 }}>
      <Stack
        direction="row"
        flexWrap="wrap"
        spacing={gap}
        justifyContent="center"
      >
        {children}
      </Stack>
    </Box>
  );
}
