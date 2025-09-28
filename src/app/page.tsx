"use client";

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // Redirect to index.html
    window.location.replace('/index.html');
  }, []);

  return null;
}