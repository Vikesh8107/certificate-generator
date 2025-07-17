// pages/index.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Simple SVG icons for a cleaner look without extra dependencies
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);
const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);


export default function Home() {
  const [fullName, setFullName] = useState("");
  const [awardedOn, setAwardedOn] = useState("");
  const [duration, setDuration] = useState("");
  const [uniqueCode, setUniqueCode] = useState("");
  const certRef = useRef<HTMLDivElement>(null);

  function generateCode() {
    return `GA-${Math.floor(100000 + Math.random() * 900000)}`;
  }

  useEffect(() => {
    setUniqueCode(generateCode());
  }, []);

  const handleDownload = async () => {
    if (!certRef.current) return;
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null, // Use null for transparent background
        ignoreElements: (element) => element.classList.contains('ignore-download'),
      });
      const imgData = canvas.toDataURL("image/png");
      
      // Use A4 dimensions, but in landscape if certificate is wider than tall
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const finalImgWidth = imgWidth * ratio;
      const finalImgHeight = imgHeight * ratio;
      const x = (pdfWidth - finalImgWidth) / 2;
      const y = (pdfHeight - finalImgHeight) / 2;
      
      pdf.addImage(imgData, "PNG", x, y, finalImgWidth, finalImgHeight);
      pdf.save(`${fullName.trim() || 'Certificate'}_GA.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating certificate. Please try again.');
    }
  };

  return (
    // MAIN PAGE CONTAINER: Upgraded with a beautiful, dark gradient background
    <div className="min-h-screen w-full bg-gray-900 text-white font-sans p-4 md:p-8"
         style={{ background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' }}>
      
      <div className="max-w-7xl mx-auto">
        {/* HEADER: More impactful with gradient text and a professional subtitle */}
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent pb-2">
            Certificate Generator
          </h1>
          <p className="text-lg text-gray-400">
            Craft and customize certificates for the <span className="font-semibold text-gray-300">Great Academy of Spoken English</span>.
          </p>
        </header>

        {/* LAYOUT: Switched to a responsive 2-column grid for a better user experience */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN - CONTROLS: Modern "glassmorphism" card for the form */}
          <div className="lg:col-span-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 h-full">
              <h2 className="text-2xl font-bold mb-6 text-gray-200">Customize Details</h2>
              
              <div className="space-y-6">
                {/* INPUT FIELD: Upgraded with icons and better focus styles */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><UserIcon /></div>
                    <input
                      type="text"
                      placeholder="Enter student's name"
                      className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Awarded On</label>
                   <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><CalendarIcon /></div>
                    <input
                      type="text"
                      placeholder="e.g., July 18, 2025"
                      className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300"
                      value={awardedOn}
                      onChange={(e) => setAwardedOn(e.target.value)}
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Duration</label>
                   <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><ClockIcon /></div>
                    <input
                      type="text"
                      placeholder="e.g., 6 weeks / 36 hours"
                      className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Certificate Code</label>
                   <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><CodeIcon /></div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-3 py-2.5 bg-black/20 border border-white/10 rounded-lg text-gray-400 cursor-not-allowed"
                      value={uniqueCode}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* DOWNLOAD BUTTON: Now with gradient, icon, and satisfying hover effect */}
              <div className="mt-8">
                <button
                  onClick={handleDownload}
                  className="w-full cursor-pointer flex items-center justify-center gap-3 px-6 py-3 font-bold text-gray-900 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg shadow-lg hover:scale-105 hover:shadow-yellow-400/40 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-400"
                >
                  <DownloadIcon />
                  Download Certificate
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - CERTIFICATE PREVIEW: Added a subtle glow on hover */}
          <div className="lg:col-span-8 flex items-center justify-center">
             <div className="w-full max-w-[700px] aspect-[700/1024] transform transition-all duration-300 hover:shadow-[0_0_35px_rgba(251,191,36,0.5)] rounded-lg">
                <div
                ref={certRef}
                className="relative w-full h-full bg-cover bg-center"
                style={{
                    backgroundImage: "url('/certificate-template.png')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                }}
                >
                {/* --- Certificate content remains unchanged as requested --- */}
                {/* Certificate Title */}
                <div className="absolute top-[60px] w-full text-center">
                    <h1 className="text-6xl font-bold mb-2" style={{ fontFamily: 'serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', letterSpacing: '3px', color: '#FFD700' }}>
                    CERTIFICATE
                    </h1>
                    <h2 className="text-3xl font-semibold" style={{ fontFamily: 'serif', textShadow: '1px 1px 2px rgba(0,0,0,0.4)', letterSpacing: '2px', color: '#FBBF24' }}>
                    of Completion
                    </h2>
                </div>

                {/* Main content area */}
                <div className="absolute left-[60px] right-[60px] top-[400px]">
                    <div className="text-center mb-4">
                    <p className="text-lg font-semibold text-black mb-2">This is to certify that</p>
                    </div>
                    
                    <div className="text-center mb-3">
                    <h2 className="text-4xl font-bold italic text-black" style={{ fontFamily: 'serif', borderBottom: '1px solid #000', paddingBottom: '2px', display: 'inline-block', minWidth: '300px' }}>
                        {fullName || "Your Name Here"}
                    </h2>
                    </div>

                    <div className="text-center mb-3">
                    <p className="text-md text-black leading-relaxed">
                        has successfully completed the <strong>Spoken English</strong> course at<br />
                        <strong>Great Academy of Spoken English</strong>
                    </p>
                    </div>

                    <div className="text-center mb-6">
                    <p className="text-xs text-black leading-relaxed px-4" style={{ maxWidth: '500px', margin: '0 auto', lineHeight: '1.4' }}>
                        Demonstrating a Strong Commitment to Learning and Outstanding Performance<br />
                        in all areas of Communication and Spoken English
                    </p>
                    </div>

                    <div className="text-center mt-[-9px]">
                    <div className="inline-block text-left text-sm text-black" style={{ border: '1px solid #ccc', padding: '12px 20px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        <p className="mb-2">📅 <strong>Awarded on:</strong> {awardedOn || "July 18, 2025"}</p>
                        <p className="mb-2">⏱️ <strong>Course Duration:</strong> {duration || "6 Weeks"}</p>
                        <p>🆔 <strong>Certificate ID:</strong> {uniqueCode}</p>
                    </div>
                    </div>
                </div>

                {/* Decorative Seal/Logo */}
                <div className="absolute bottom-[33px] right-[30px]" style={{ width: '50px', height: '50px', zIndex: 10 }}>
                    <div className="relative w-full h-full">
                    <div className="absolute inset-0 rounded-full border-4 border-double" style={{ borderColor: '#B8860B', background: 'radial-gradient(circle, #FFD700, #B8860B)', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}></div>
                    <div className="absolute inset-2 rounded-full flex flex-col items-center justify-center text-center" style={{ border: '2px solid #B8860B', background: 'linear-gradient(to bottom right, #FBBF24, #D97706)' }}>
                        <div className="text-white font-bold text-lg leading-none" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)', fontSize: '16px' }}></div>
                    </div>
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-lg" style={{ color: '#FBBF24' }}>✦</div>
                    <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 text-lg" style={{ color: '#FBBF24' }}>✦</div>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-lg" style={{ color: '#FBBF24' }}>✦</div>
                    <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 text-lg" style={{ color: '#FBBF24' }}>✦</div>
                    </div>
                </div>

                {/* Signature line */}
                <div className="absolute bottom-[110px] right-[90px]" style={{ width: '190px', zIndex: 5 }}>
                    <div className="text-center ">
                    <div className="border-t-2 border-black " style={{ width: '150px', margin: '0 auto' }}></div>
                    <p className="text-sm font-semibold text-black">Authorized Signature</p>
                    <p className="text-xs text-black">Director, Great Academy</p>
                    </div>
                </div>
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}