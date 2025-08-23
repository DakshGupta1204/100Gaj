"use client";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function MainSiteDocsPage() {
  return (
    <div className="bg-white text-black dark:bg-white dark:text-black">
      <SwaggerUI url="/main-site-swagger.json" />
    </div>
  );
}
