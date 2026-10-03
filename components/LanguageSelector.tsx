"use client";

import React from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

/**
 * Re-export LanguageSwitcher as LanguageSelector for full backwards compatibility
 */
export default function LanguageSelector(props: React.ComponentProps<typeof LanguageSwitcher>) {
  return <LanguageSwitcher {...props} />;
}

export { LanguageSwitcher };
