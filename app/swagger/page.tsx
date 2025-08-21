"use client";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function DocsPage() {
  return (
    <div className="bg-white text-black dark:bg-white dark:text-black">
      <SwaggerUI url="/swagger.json" />
    </div>
  );
}
