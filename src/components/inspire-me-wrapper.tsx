"use client";

import { useState } from "react";
import { InspireMeButton, InspireMeModal } from "@/components/inspire-me";

export default function InspireMeWrapper() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <InspireMeButton onClick={() => setOpen(true)} />
      <InspireMeModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
