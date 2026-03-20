"use client";

import { useState, useRef } from "react";
import * as htmlToImage from "html-to-image";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

export default function Home() {
  const [croppedQr, setCroppedQr] = useState(null);
  const [src, setSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const cardRef = useRef(null);
  const cropperRef = useRef(null);
  const fileInputRef = useRef(null);

  const BKASH_PINK = "#e2136e";

  const handleImageUpload = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSrc(reader.result);
      setCroppedQr(null);
      setIsLoading(false);
    };
    if (files && files[0]) {
      reader.readAsDataURL(files[0]);
    }
  };

  const cropImage = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      if (croppedCanvas) {
        const dataUrl = croppedCanvas.toDataURL();
        setIsLoading(true);
        setSrc(null);
        setTimeout(() => {
          setCroppedQr(dataUrl);
          setIsLoading(false);
        }, 2000);
      }
    }
  };

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        // iOS এর জন্য pixelRatio: 2 এবং cacheBust: true ব্যবহার করা হয়েছে
        const dataUrl = await htmlToImage.toPng(cardRef.current, { 
          quality: 1, 
          pixelRatio: 2,
          cacheBust: true,
          // iOS Safari তে ইমেজ লোড হওয়ার সময় দেওয়ার জন্য
          backgroundColor: null,
        });
        
        // iOS/Mobile Native Share API (গ্যালারিতে সেভ করার জন্য)
        if (navigator.share) {
          try {
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            const file = new File([blob], "eid-salami-card.png", { type: blob.type });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: 'ঈদ সালামি কার্ড',
                text: 'আমার বিকাশ সালামি কার্ড স্ক্যান করুন!',
              });
              return; 
            }
          } catch (shareError) {
            console.log("শেয়ার ক্যান্সেল হয়েছে:", shareError);
          }
        }

        // PC বা ফলব্যাক ডাউনলোড
        const link = document.createElement("a");
        link.download = "premium-bkash-card.png";
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      } catch (error) {
        console.error("কার্ড ডাউনলোড করতে সমস্যা হয়েছে:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 font-sans">
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-3 flex flex-wrap justify-center gap-2">
          বিকাশ <span style={{ color: BKASH_PINK }}>প্রিমিয়াম</span>  
          <span>সালামি কার্ড জেনারেটর</span>
        </h1>
        <p className="text-gray-400">আপনার bKash QR কোড আপলোড করুন এবং নতুন কার্ড তৈরি করুন</p>
      </div>

      {/* নির্দেশিকা সেকশন */}
      {!src && !croppedQr && !isLoading && (
        <div className="mb-8 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className={`absolute -top-10 -right-10 w-32 h-32 bg-[${BKASH_PINK}] rounded-full blur-3xl opacity-10`}></div>
          <div className={`absolute -bottom-10 -left-10 w-32 h-32 bg-[${BKASH_PINK}] rounded-full blur-3xl opacity-10`}></div>
          
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2 relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={BKASH_PINK} className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            কীভাবে তৈরি করবেন?
          </h2>
          
          <ul className="space-y-4 text-gray-300 text-sm relative z-10 font-medium">
            <li className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-full bg-[${BKASH_PINK}]/20 text-[${BKASH_PINK}] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[${BKASH_PINK}]/30`}>১</div>
              <p className="leading-relaxed">প্রথমে আপনার মোবাইলের <strong className="text-white">বিকাশ (bKash) অ্যাপে</strong> প্রবেশ করুন।</p>
            </li>
            <li className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-full bg-[${BKASH_PINK}]/20 text-[${BKASH_PINK}] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[${BKASH_PINK}]/30`}>২</div>
              <p className="leading-relaxed">এরপর <strong className="text-white">"আমার বিকাশ" (My bKash)</strong> এ গিয়ে ডানে কোনায় থাকা <strong className="text-white">QR কোড</strong> অপশনে যান এবং সেখান থেকে আপনার QR কোডটি ডাউনলোড করুন।</p>
            </li>
            <li className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-full bg-[${BKASH_PINK}]/20 text-[${BKASH_PINK}] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[${BKASH_PINK}]/30`}>৩</div>
              <p className="leading-relaxed">সেই ছবিটি নিচের <strong className="text-white">"QR কোড আপলোড করুন"</strong> বাটনে ক্লিক করে এখানে আপলোড করুন।</p>
            </li>
          </ul>
        </div>
      )}

      <div className="mb-8 flex flex-col items-center gap-4">
        <button 
          onClick={() => fileInputRef.current.click()}
          className={`cursor-pointer bg-[${BKASH_PINK}] hover:bg-[#c10e5a] text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-[${BKASH_PINK}/30] flex items-center gap-2`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          QR কোড আপলোড করুন
        </button>
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleImageUpload} 
        />
      </div>

      {src && !isLoading && (
        <div className="flex flex-col items-center w-full max-w-md">
          <div className="w-full bg-white/5 p-4 rounded-3xl backdrop-blur-sm border border-white/10 overflow-hidden">
            <Cropper
              ref={cropperRef}
              style={{ height: 350, width: "100%" }}
              initialAspectRatio={1}
              preview=".img-preview"
              src={src}
              viewMode={1}
              minCropBoxHeight={50}
              minCropBoxWidth={50}
              background={false}
              responsive={true}
              autoCropArea={0.8}
              checkOrientation={false}
              guides={true}
              dragMode="move"
            />
          </div>
          <button 
            onClick={cropImage}
            className={`mt-6 w-full max-w-[200px] bg-[${BKASH_PINK}] hover:bg-[#c10e5a] text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg flex items-center justify-center gap-2`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            ছবি ক্রপ করুন
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center mt-16 space-y-6">
          <div className="relative flex justify-center items-center">
            <div className={`absolute animate-ping w-20 h-20 rounded-full bg-[${BKASH_PINK}] opacity-40`}></div>
            <svg className={`animate-spin relative z-10 w-14 h-14 text-[${BKASH_PINK}]`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className={`text-[${BKASH_PINK}] font-bold text-xl tracking-wide animate-pulse`}>
            ম্যাজিক চলছে... প্রিমিয়াম কার্ড তৈরি হচ্ছে
          </p>
        </div>
      )}

      {/* ৩. =================== শুধু এই CARD অংশটি পরিবর্তন করা হয়েছে =================== */}
      {croppedQr && !isLoading && (
        <div className="flex flex-col items-center mt-6 animate-fade-in-up">

          {/* ── Ultra Premium Navy + Gold Islamic Card ── */}
          <div
            ref={cardRef}
            style={{
              width: "380px",
              maxWidth: "calc(100vw - 32px)",
              borderRadius: "28px",
              overflow: "hidden",
              background: "linear-gradient(170deg, #08091a 0%, #0e1230 35%, #160820 65%, #08091a 100%)",
              boxShadow: "0 0 0 1px rgba(184,142,55,0.4), 0 0 0 3px rgba(184,142,55,0.1), 0 40px 80px rgba(0,0,0,0.85)",
              position: "relative",
              fontFamily: "sans-serif",
            }}
          >
            {/* ── Double inner border ring ── */}
            <div style={{ position: "absolute", inset: "5px", borderRadius: "24px", border: "1px solid rgba(184,142,55,0.2)", pointerEvents: "none", zIndex: 10 }} />

            {/* ── Arabesque corner — top-left ── */}
            <div style={{ position: "absolute", top: 0, left: 0, width: "88px", height: "88px", pointerEvents: "none", zIndex: 8, opacity: 0.55 }}>
              <svg viewBox="0 0 88 88" width="88" height="88" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,0 L35,0 Q0,0 0,35 Z" fill="none" stroke="#B8A050" strokeWidth="1"/>
                <path d="M0,0 L22,0 Q0,0 0,22 Z" fill="none" stroke="#FFD700" strokeWidth="0.7"/>
                <path d="M8,0 L8,8 Q8,16 16,16 L0,16" fill="none" stroke="#B8A050" strokeWidth="0.6"/>
                <circle cx="16" cy="16" r="3.5" fill="none" stroke="#B8A050" strokeWidth="0.8"/>
                <circle cx="8" cy="8" r="1.5" fill="rgba(255,215,0,0.6)"/>
              </svg>
            </div>

            {/* ── Arabesque corner — top-right ── */}
            <div style={{ position: "absolute", top: 0, right: 0, width: "88px", height: "88px", pointerEvents: "none", zIndex: 8, opacity: 0.55, transform: "scaleX(-1)" }}>
              <svg viewBox="0 0 88 88" width="88" height="88" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,0 L35,0 Q0,0 0,35 Z" fill="none" stroke="#B8A050" strokeWidth="1"/>
                <path d="M0,0 L22,0 Q0,0 0,22 Z" fill="none" stroke="#FFD700" strokeWidth="0.7"/>
                <path d="M8,0 L8,8 Q8,16 16,16 L0,16" fill="none" stroke="#B8A050" strokeWidth="0.6"/>
                <circle cx="16" cy="16" r="3.5" fill="none" stroke="#B8A050" strokeWidth="0.8"/>
                <circle cx="8" cy="8" r="1.5" fill="rgba(255,215,0,0.6)"/>
              </svg>
            </div>

            {/* ── Arabesque corner — bottom-left ── */}
            <div style={{ position: "absolute", bottom: 0, left: 0, width: "88px", height: "88px", pointerEvents: "none", zIndex: 8, opacity: 0.55, transform: "scaleY(-1)" }}>
              <svg viewBox="0 0 88 88" width="88" height="88" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,0 L35,0 Q0,0 0,35 Z" fill="none" stroke="#B8A050" strokeWidth="1"/>
                <path d="M0,0 L22,0 Q0,0 0,22 Z" fill="none" stroke="#FFD700" strokeWidth="0.7"/>
                <path d="M8,0 L8,8 Q8,16 16,16 L0,16" fill="none" stroke="#B8A050" strokeWidth="0.6"/>
                <circle cx="16" cy="16" r="3.5" fill="none" stroke="#B8A050" strokeWidth="0.8"/>
              </svg>
            </div>

            {/* ── Arabesque corner — bottom-right ── */}
            <div style={{ position: "absolute", bottom: 0, right: 0, width: "88px", height: "88px", pointerEvents: "none", zIndex: 8, opacity: 0.55, transform: "scale(-1,-1)" }}>
              <svg viewBox="0 0 88 88" width="88" height="88" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,0 L35,0 Q0,0 0,35 Z" fill="none" stroke="#B8A050" strokeWidth="1"/>
                <path d="M0,0 L22,0 Q0,0 0,22 Z" fill="none" stroke="#FFD700" strokeWidth="0.7"/>
                <path d="M8,0 L8,8 Q8,16 16,16 L0,16" fill="none" stroke="#B8A050" strokeWidth="0.6"/>
                <circle cx="16" cy="16" r="3.5" fill="none" stroke="#B8A050" strokeWidth="0.8"/>
              </svg>
            </div>

            {/* ── 12-point Islamic star watermark ── */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.04, pointerEvents: "none", zIndex: 1 }}>
              <svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
                {Array.from({ length: 12 }).map((_, i) => (
                  <polygon key={i} points="160,10 167,148 160,160 153,148" fill="#FFD700" transform={`rotate(${i * 30} 160 160)`} />
                ))}
                <circle cx="160" cy="160" r="60" fill="none" stroke="#FFD700" strokeWidth="0.8"/>
                <circle cx="160" cy="160" r="100" fill="none" stroke="#FFD700" strokeWidth="0.4"/>
              </svg>
            </div>

            {/* ── Purple-tinted radial glow center ── */}
            <div style={{ position: "absolute", top: "38%", left: "50%", transform: "translate(-50%,-50%)", width: "340px", height: "340px", borderRadius: "50%", background: "radial-gradient(circle, rgba(120,70,180,0.1) 0%, transparent 65%)", pointerEvents: "none", zIndex: 1 }} />

            {/* ── TOP ORNAMENTAL GOLD BAR ── */}
            <div style={{ height: "7px", background: "linear-gradient(90deg, transparent, #6b4800, #B8A050, #FFE87C, #FFD700, #FFE87C, #B8A050, #6b4800, transparent)" }} />
            <div style={{ padding: "0 20px" }}>
              <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(184,160,80,0.6), rgba(255,232,124,0.8), rgba(184,160,80,0.6), transparent)", marginTop: "2px" }} />
            </div>

            {/* ── CONTENT ── */}
            <div style={{ padding: "18px 28px 0px", position: "relative", zIndex: 6 }}>

              {/* ── Header row: sparkles + Eid text + crescent ── */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                  {[8, 5, 7].map((s, i) => (
                    <svg key={i} width={s} height={s} viewBox="0 0 12 12">
                      <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z" fill="rgba(255,215,0,0.55)" />
                    </svg>
                  ))}
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", letterSpacing: "4px", color: "rgba(255,215,0,0.88)", textTransform: "uppercase" }}>ঈদ মোবারক</p>
                  <p style={{ margin: "3px 0 0", fontSize: "9px", letterSpacing: "3.5px", color: "rgba(255,215,0,0.4)", textTransform: "uppercase" }}>Eid Mubarak</p>
                </div>
                <svg width="38" height="38" viewBox="0 0 38 38">
                  <circle cx="19" cy="19" r="14" fill="rgba(255,215,0,0.15)" />
                  <circle cx="25" cy="14" r="11.5" fill="#08091a" />
                  <circle cx="10" cy="8" r="1.5" fill="rgba(255,215,0,0.6)" />
                  <circle cx="30" cy="28" r="1" fill="rgba(255,215,0,0.5)" />
                </svg>
              </div>

              {/* ── Ornamental divider ── */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(184,160,80,0.5))" }} />
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <path d="M7 0L8.3 5.2L14 7L8.3 8.8L7 14L5.7 8.8L0 7L5.7 5.2Z" fill="rgba(255,215,0,0.65)" />
                </svg>
                <svg width="8" height="8" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" fill="none" stroke="rgba(184,160,80,0.6)" strokeWidth="0.8"/>
                </svg>
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <path d="M7 0L8.3 5.2L14 7L8.3 8.8L7 14L5.7 8.8L0 7L5.7 5.2Z" fill="rgba(255,215,0,0.65)" />
                </svg>
                <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(184,160,80,0.5), transparent)" }} />
              </div>

              {/* ── QR FRAME — triple-layer luxury ── */}
              <div style={{ margin: "0 auto", width: "248px", position: "relative" }}>
                {/* Outer glow ring */}
                <div style={{ position: "absolute", inset: "-6px", borderRadius: "26px", background: "linear-gradient(145deg, rgba(255,215,0,0.25), rgba(180,130,40,0.1), rgba(255,215,0,0.25))", zIndex: 0 }} />
                {/* Gold gradient border */}
                <div style={{ padding: "3px", borderRadius: "22px", background: "linear-gradient(145deg, #FFE87C, #B8A050, #6b4800, #B8A050, #FFE87C)", position: "relative", zIndex: 1, boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(255,215,0,0.08)" }}>
                  <div style={{ borderRadius: "20px", background: "#fff", padding: "10px", position: "relative" }}>
                    {/* Gold corner brackets */}
                    {[
                      { top: "6px", left: "6px", borderTop: "3px solid #B8A050", borderLeft: "3px solid #B8A050", borderRadius: "4px 0 0 0" },
                      { top: "6px", right: "6px", borderTop: "3px solid #B8A050", borderRight: "3px solid #B8A050", borderRadius: "0 4px 0 0" },
                      { bottom: "6px", left: "6px", borderBottom: "3px solid #B8A050", borderLeft: "3px solid #B8A050", borderRadius: "0 0 0 4px" },
                      { bottom: "6px", right: "6px", borderBottom: "3px solid #B8A050", borderRight: "3px solid #B8A050", borderRadius: "0 0 4px 0" },
                    ].map((s, i) => (
                      <div key={i} style={{ position: "absolute", width: "18px", height: "18px", ...s }} />
                    ))}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={croppedQr}
                      alt="bKash QR Code"
                      decoding="sync"
                      crossOrigin="anonymous"
                      style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "10px", display: "block" }}
                    />
                  </div>
                </div>
              </div>

              {/* ── Mosque silhouette ── */}
              <div style={{ margin: "16px auto 0", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", opacity: 0.28 }}>
                <svg width="260" height="44" viewBox="0 0 260 44" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
                  <ellipse cx="130" cy="30" rx="38" ry="26" fill="#B8A050"/>
                  <rect x="92" y="28" width="76" height="16" fill="#B8A050"/>
                  <rect x="62" y="14" width="10" height="30" fill="#B8A050"/>
                  <ellipse cx="67" cy="14" rx="5" ry="7" fill="#B8A050"/>
                  <rect x="65" y="6" width="4" height="8" fill="#B8A050"/>
                  <polygon points="67,0 70,6 64,6" fill="#B8A050"/>
                  <rect x="188" y="14" width="10" height="30" fill="#B8A050"/>
                  <ellipse cx="193" cy="14" rx="5" ry="7" fill="#B8A050"/>
                  <rect x="191" y="6" width="4" height="8" fill="#B8A050"/>
                  <polygon points="193,0 196,6 190,6" fill="#B8A050"/>
                  <ellipse cx="90" cy="26" rx="16" ry="12" fill="#B8A050"/>
                  <rect x="74" y="24" width="32" height="20" fill="#B8A050"/>
                  <ellipse cx="170" cy="26" rx="16" ry="12" fill="#B8A050"/>
                  <rect x="154" y="24" width="32" height="20" fill="#B8A050"/>
                  <rect x="50" y="43" width="160" height="1" fill="#B8A050"/>
                  <circle cx="130" cy="6" r="5" fill="#B8A050"/>
                  <circle cx="133" cy="4" r="4" fill="#08091a"/>
                  <circle cx="137" cy="0" r="1" fill="#B8A050"/>
                </svg>
              </div>

              {/* ── bKash branding ── */}
              <div style={{ textAlign: "center", marginTop: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(184,160,80,0.45))" }} />
                  <span style={{ fontSize: "34px", fontWeight: "900", color: "#E2136E", letterSpacing: "-1px", lineHeight: 1 }}>bKash</span>
                  <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(184,160,80,0.45), transparent)" }} />
                </div>

                {/* Gold shimmer rule */}
                <div style={{ margin: "8px auto", width: "120px", height: "2px", borderRadius: "2px", background: "linear-gradient(90deg, transparent, #6b4800, #FFD700, #FFE87C, #FFD700, #6b4800, transparent)" }} />

                {/* Salami badge */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 20px", borderRadius: "30px", background: "rgba(255,215,0,0.07)", border: "1px solid rgba(184,160,80,0.35)", marginBottom: "4px" }}>
                  <svg width="8" height="8" viewBox="0 0 12 12"><path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z" fill="rgba(255,215,0,0.8)"/></svg>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,215,0,0.82)", letterSpacing: "0.8px" }}>ঈদ সালামি পাঠান</span>
                  <svg width="8" height="8" viewBox="0 0 12 12"><path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z" fill="rgba(255,215,0,0.8)"/></svg>
                </div>

                <p style={{ margin: "8px 0 0", fontSize: "9px", color: "rgba(255,255,255,0.2)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  bKash App দিয়ে স্ক্যান করুন
                </p>
              </div>
            </div>

            {/* ── Islamic star border strip ── */}
            <div style={{ margin: "16px 20px 0", height: "20px", overflow: "hidden", opacity: 0.32 }}>
              <svg width="340" height="20" viewBox="0 0 340 20" xmlns="http://www.w3.org/2000/svg">
                {Array.from({ length: 17 }).map((_, i) => (
                  <polygon key={i} points="10,0 13,7 20,7 14.5,11 16.5,18 10,14 3.5,18 5.5,11 0,7 7,7" fill="#B8A050" transform={`translate(${i * 20}, 0)`} />
                ))}
              </svg>
            </div>

            {/* ── BOTTOM ORNAMENTAL GOLD BAR ── */}
            <div style={{ height: "7px", marginTop: "14px", background: "linear-gradient(90deg, transparent, #6b4800, #B8A050, #FFE87C, #FFD700, #FFE87C, #B8A050, #6b4800, transparent)" }} />
          </div>
          {/* ══════════════════════════════════════════════════════════════════════════ */}

          <button 
            onClick={handleDownload}
            className="mt-8 bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full font-bold transition-all shadow-lg flex items-center gap-2 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 group-hover:animate-bounce">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            কার্ডটি ডাউনলোড করুন
          </button>
        </div>
      )}

      <canvas ref={cropperRef} className="hidden"></canvas>
    </div>
  );
}