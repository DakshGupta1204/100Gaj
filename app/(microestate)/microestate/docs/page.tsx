'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
// // Dynamically import SwaggerUI to avoid SSR issues
// const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });


// Fix the CSS import - use the correct path
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadApiSpec = async () => {
      try {
        // Load the API specification
        const response = await fetch('/microestate/api/docs');
        if (!response.ok) {
          throw new Error('Failed to load API specification');
        }
        const apiSpec = await response.json();
        setSpec(apiSpec);
      } catch (err: any) {
        console.error('Error loading API spec:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadApiSpec();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading API Documentation...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
     

      {/* Swagger UI */}
      <div className="max-w-7xl mx-auto">
        {spec && (
          <SwaggerUI
            spec={spec}
            docExpansion="list"
            defaultModelExpandDepth={2}
            defaultModelsExpandDepth={1}
            deepLinking={true}
            displayRequestDuration={true}
            filter={true}
            showExtensions={true}
            showCommonExtensions={true}
            tryItOutEnabled={true}
            requestInterceptor={(request) => {
              // Add any request interceptor logic here
              console.log('Request:', request);
              return request;
            }}
            responseInterceptor={(response) => {
              // Add any response interceptor logic here
              console.log('Response:', response);
              return response;
            }}
            onComplete={(system) => {
              console.log('Swagger UI loaded:', system);
            }}
            presets={[
              // You can add custom presets here if needed
            ]}
            plugins={[
              // You can add custom plugins here if needed
            ]}
            layout="BaseLayout"
            validatorUrl="https://validator.swagger.io/validator"
          />
        )}
      </div>

     
    </div>
  );
}