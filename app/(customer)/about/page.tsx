import React from 'react';
import Image from 'next/image';

export const metadata = {
  title: 'About Us | Society Enterprises Pvt. Ltd.',
  description: 'Authorized Dealer of Syakar Trading Company for Honda Motorcycles and Power Products in Damak, Jhapa.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold md:text-5xl font-extrabold text-gray-900 mb-4">
            About <span className="text-primary">Society Enterprises</span>
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-gray-600 max-w-3xl mx-auto">
            Authorized Dealer of Syakar Trading Company for Honda Motorcycles and Power Products in Damak, Jhapa, Nepal.
          </p>
        </div>

        {/* Company Profile */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-bold text-gray-900 mb-6">Our History & Vision</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Society Enterprises Pvt. Ltd., operating as Damak Honda,
                has been the trusted name for Honda vehicles in Eastern Nepal. We are committed to providing 
                exceptional sales, servicing, and genuine spare parts for all Honda Motorcycles, Scooters, and Power Products.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our vision is to empower the community with reliable mobility solutions while maintaining the 
                highest standards of customer satisfaction and after-sales support. We strive to be the 
                benchmark of excellence in the automobile dealership industry.
              </p>
            </div>
            <div className="md:w-1/2 bg-gray-200 relative min-h-[300px]">
              {/* Replace with actual image */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <span className="text-lg font-medium">Showroom Facility</span>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Management */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-bold text-center text-gray-900 mb-12">Executive Management</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            <div className="bg-white p-8 rounded-2xl shadow-md text-center hover:shadow-xl transition-shadow border-t-4 border-primary">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-gray-400">Photo</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold font-bold text-gray-900 mb-2">Chairman / Managing Director</h3>
              <p className="text-gray-500 mb-4">Society Enterprises Pvt. Ltd.</p>
              <p className="text-gray-600 text-sm">
                Leading the vision and strategic growth of Society Enterprises, ensuring top-tier service delivery across all branches.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md text-center hover:shadow-xl transition-shadow border-t-4 border-primary">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-gray-400">Photo</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold font-bold text-gray-900 mb-2">Operations Director</h3>
              <p className="text-gray-500 mb-4">Society Enterprises Pvt. Ltd.</p>
              <p className="text-gray-600 text-sm">
                Overseeing daily showroom operations, logistics, servicing excellence, and customer relationship management.
              </p>
            </div>

          </div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-red-100 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h4 className="text-xl md:text-2xl font-semibold font-bold mb-2">Trust & Reliability</h4>
            <p className="text-gray-600 text-sm">Genuine Honda parts and certified mechanics you can count on.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-red-100 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.514"></path></svg>
            </div>
            <h4 className="text-xl md:text-2xl font-semibold font-bold mb-2">Customer First</h4>
            <p className="text-gray-600 text-sm">Dedicated to making your purchase and servicing journey seamless.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-red-100 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h4 className="text-xl md:text-2xl font-semibold font-bold mb-2">Innovation & Growth</h4>
            <p className="text-gray-600 text-sm">Bringing the latest Honda technologies and models to Eastern Nepal.</p>
          </div>
        </div>

      </div>
    </main>
  );
}
