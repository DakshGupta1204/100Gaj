import React from 'react';
import Navbar from '../_components/Navbar';
import Footer from '../_components/Footer';
import AuthProvider from '../Context/AuthProvider';
export const metadata = {
    title: 'Microestate Dashboard | 100गज',
    description: 'Manage properties, listings, and insights.',
};
export default function MicroestateLayout({ children, }) {
    return (<AuthProvider>
    <div className="flex min-h-screen">
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="">{children}</main>
        <Footer />
      </div>
    </div>
    </AuthProvider>);
}
