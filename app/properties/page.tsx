import React from "react";
import Link from "next/link";

export default function PropertiesPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>All Properties</h1>
      {/* Placeholder for property listings */}
      <p>Show all properties here...</p>

      <h2>Your Favourites</h2>
      {/* Button to go to Favourites page */}
      <Link href="/favourites">
        <button style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>Go to Favourites</button>
      </Link>
    </div>
  );
} 