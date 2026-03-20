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
        const dataUrl = await htmlToImage.toPng(cardRef.current, { quality: 1, pixelRatio: 3 });
        const link = document.createElement("a");
        link.download = "premium-bkash-card.png";
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("কার্ড ডাউনলোড করতে সমস্যা হয়েছে:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 font-sans">
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-3">
          বিকাশ <span style={{ color: BKASH_PINK }}>প্রিমিয়াম</span> কার্ড জেনারেটর
        </h1>
        <p className="text-gray-400">আপনার bKash QR কোড আপলোড করুন এবং নতুন কার্ড তৈরি করুন</p>
      </div>

      {/* =================== নতুন গ্লাসমরফিজম ইন্সট্রাকশন সেকশন =================== */}
      {!src && !croppedQr && !isLoading && (
        <div className="mb-8 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
          {/* গ্লো এফেক্ট */}
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
              <p className="leading-relaxed">উপরের দিকের আইকন থেকে <strong className="text-white">"আপনার QR কোড"</strong> (Your QR Code) অপশনে যান এবং ছবিটি ডাউনলোড/সেভ করুন।</p>
            </li>
            <li className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-full bg-[${BKASH_PINK}]/20 text-[${BKASH_PINK}] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[${BKASH_PINK}]/30`}>৩</div>
              <p className="leading-relaxed">সেই ছবিটি নিচের <strong className="text-white">"QR কোড আপলোড করুন"</strong> বাটনে ক্লিক করে এখানে আপলোড করুন।</p>
            </li>
          </ul>
        </div>
      )}
      {/* ========================================================================= */}

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
        <div className="flex flex-col items-center">
          <Cropper
            ref={cropperRef}
            style={{ height: 400, width: "100%" }}
            initialAspectRatio={1}
            preview=".img-preview"
            src={src}
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
            guides={true}
          />
          <button 
            onClick={cropImage}
            className={`mt-4 bg-[${BKASH_PINK}] hover:bg-[#c10e5a] text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg flex items-center gap-2`}
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

      {croppedQr && !isLoading && (
        <div className="flex flex-col items-center mt-6 animate-fade-in-up">

          {/* ── Ultra Premium Eid Salami Card ── */}
          <div
            ref={cardRef}
            style={{
              width: "360px",
              borderRadius: "32px",
              overflow: "hidden",
              background: "linear-gradient(155deg, #060e08 0%, #0b1f10 40%, #071a0c 70%, #040c06 100%)",
              boxShadow: "0 40px 80px -10px rgba(0,0,0,0.9), 0 0 0 1px rgba(212,175,55,0.25), inset 0 1px 0 rgba(255,215,0,0.08)",
              position: "relative",
              fontFamily: "sans-serif",
            }}
          >
            {/* ── Inner border ring ── */}
            <div style={{
              position: "absolute", inset: "7px",
              borderRadius: "26px",
              border: "1px solid rgba(212,175,55,0.15)",
              pointerEvents: "none",
              zIndex: 2,
            }} />

            {/* ── Islamic 8-star geometric pattern top ── */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0,
              height: "130px", overflow: "hidden",
              opacity: 0.055, pointerEvents: "none", zIndex: 1,
            }}>
              <svg width="360" height="130" viewBox="0 0 360 130" xmlns="http://www.w3.org/2000/svg">
                {Array.from({ length: 10 }).map((_, i) =>
                  Array.from({ length: 4 }).map((_, j) => (
                    <polygon
                      key={`${i}-${j}`}
                      points="20,0 23,14 37,14 26,23 30,37 20,28 10,37 14,23 3,14 17,14"
                      fill="#FFD700"
                      transform={`translate(${i * 40 - 10}, ${j * 40 - 10})`}
                    />
                  ))
                )}
              </svg>
            </div>

            {/* ── Islamic 8-star geometric pattern bottom ── */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              height: "110px", overflow: "hidden",
              opacity: 0.055, pointerEvents: "none", zIndex: 1,
            }}>
              <svg width="360" height="110" viewBox="0 0 360 110" xmlns="http://www.w3.org/2000/svg">
                {Array.from({ length: 10 }).map((_, i) =>
                  Array.from({ length: 3 }).map((_, j) => (
                    <polygon
                      key={`${i}-${j}`}
                      points="20,0 23,14 37,14 26,23 30,37 20,28 10,37 14,23 3,14 17,14"
                      fill="#FFD700"
                      transform={`translate(${i * 40 - 10}, ${j * 40 - 10})`}
                    />
                  ))
                )}
              </svg>
            </div>

            {/* ── Center radial glow ── */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "300px", height: "300px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(18,55,22,0.5) 0%, transparent 70%)",
              pointerEvents: "none", zIndex: 1,
            }} />

            {/* ── Crescent moon ── */}
            <div style={{ position: "absolute", top: "18px", right: "22px", zIndex: 5, pointerEvents: "none" }}>
              <svg width="46" height="46" viewBox="0 0 46 46">
                <circle cx="23" cy="23" r="17" fill="rgba(255,215,0,0.2)" />
                <circle cx="30" cy="17" r="14" fill="#060e08" />
              </svg>
            </div>

            {/* ── Sparkle stars ── */}
            <div style={{ position: "absolute", top: "24px", right: "76px", zIndex: 5, pointerEvents: "none" }}>
              <svg width="11" height="11" viewBox="0 0 12 12"><path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z" fill="rgba(255,215,0,0.6)" /></svg>
            </div>
            <div style={{ position: "absolute", bottom: "58px", left: "22px", zIndex: 5, pointerEvents: "none" }}>
              <svg width="9" height="9" viewBox="0 0 12 12"><path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z" fill="rgba(255,215,0,0.4)" /></svg>
            </div>
            <div style={{ position: "absolute", top: "52%", right: "16px", zIndex: 5, pointerEvents: "none" }}>
              <svg width="7" height="7" viewBox="0 0 12 12"><path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z" fill="rgba(255,215,0,0.3)" /></svg>
            </div>
            <div style={{ position: "absolute", top: "34%", left: "18px", zIndex: 5, pointerEvents: "none" }}>
              <svg width="7" height="7" viewBox="0 0 12 12"><path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z" fill="rgba(255,215,0,0.25)" /></svg>
            </div>

            {/* ── TOP GOLD BAR ── */}
            <div style={{
              height: "6px",
              background: "linear-gradient(90deg, transparent 0%, #6b4f00 10%, #FFD700 30%, #FFFACD 50%, #FFD700 70%, #6b4f00 90%, transparent 100%)",
            }} />

            {/* ── CONTENT ── */}
            <div style={{ padding: "22px 26px 26px", position: "relative", zIndex: 4 }}>

              {/* ── Top ornamental header ── */}
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
                  <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.55))" }} />
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path d="M9 0L10.8 6.3L18 9L10.8 11.7L9 18L7.2 11.7L0 9L7.2 6.3Z" fill="rgba(255,215,0,0.75)" />
                  </svg>
                  <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, rgba(212,175,55,0.55), transparent)" }} />
                </div>

                <p style={{
                  margin: 0, fontSize: "13px", fontWeight: "700",
                  letterSpacing: "5px", color: "rgba(255,215,0,0.8)",
                  textTransform: "uppercase",
                }}>ঈদ মোবারক</p>
                <p style={{
                  margin: "4px 0 0", fontSize: "10px",
                  letterSpacing: "3px", color: "rgba(255,215,0,0.38)",
                }}>EID MUBARAK</p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
                  <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.35))" }} />
                  <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(255,215,0,0.5)" }} />
                  <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, rgba(212,175,55,0.35), transparent)" }} />
                </div>
              </div>

              {/* ── QR CODE — luxury triple-layer frame ── */}
              <div style={{
                margin: "0 auto",
                width: "232px", height: "232px",
                padding: "3px",
                borderRadius: "24px",
                background: "linear-gradient(145deg, #FFD700 0%, #C5A028 25%, #FFF0A0 50%, #C5A028 75%, #FFD700 100%)",
                boxShadow: "0 0 0 1px rgba(255,215,0,0.12), 0 16px 48px rgba(0,0,0,0.7), 0 0 30px rgba(255,215,0,0.08)",
              }}>
                <div style={{
                  width: "100%", height: "100%",
                  borderRadius: "21px",
                  background: "#fafafa",
                  padding: "3px",
                  boxSizing: "border-box",
                }}>
                  <div style={{
                    width: "100%", height: "100%",
                    borderRadius: "19px",
                    background: "#ffffff",
                    padding: "10px",
                    boxSizing: "border-box",
                    position: "relative",
                  }}>
                    {/* Gold corner brackets */}
                    {[
                      { top: "7px", left: "7px", borderTop: "2.5px solid #C5A028", borderLeft: "2.5px solid #C5A028", borderRadius: "3px 0 0 0" },
                      { top: "7px", right: "7px", borderTop: "2.5px solid #C5A028", borderRight: "2.5px solid #C5A028", borderRadius: "0 3px 0 0" },
                      { bottom: "7px", left: "7px", borderBottom: "2.5px solid #C5A028", borderLeft: "2.5px solid #C5A028", borderRadius: "0 0 0 3px" },
                      { bottom: "7px", right: "7px", borderBottom: "2.5px solid #C5A028", borderRight: "2.5px solid #C5A028", borderRadius: "0 0 3px 0" },
                    ].map((s, i) => (
                      <div key={i} style={{ position: "absolute", width: "16px", height: "16px", ...s }} />
                    ))}
                    <img
                      src={croppedQr}
                      alt="bKash QR Code"
                      style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "8px", display: "block" }}
                    />
                  </div>
                </div>
              </div>

              {/* ── bKash logo + gold rule ── */}
              <div style={{ textAlign: "center", marginTop: "22px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                  <div style={{ height: "1px", width: "44px", background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5))" }} />
                  <span style={{
                    fontSize: "32px", fontWeight: "900", color: "#E2136E",
                    letterSpacing: "-1px", lineHeight: 1,
                  }}>bKash</span>
                  <div style={{ height: "1px", width: "44px", background: "linear-gradient(90deg, rgba(212,175,55,0.5), transparent)" }} />
                </div>

                {/* Gold shimmer divider */}
                <div style={{
                  margin: "9px auto",
                  width: "110px", height: "2px", borderRadius: "2px",
                  background: "linear-gradient(90deg, transparent, #8B6914, #FFD700, #FFFACD, #FFD700, #8B6914, transparent)",
                }} />

                {/* Salami badge */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "7px",
                  padding: "8px 18px", borderRadius: "28px",
                  background: "linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,215,0,0.04))",
                  border: "1px solid rgba(255,215,0,0.28)",
                }}>
                  <svg width="9" height="9" viewBox="0 0 12 12"><path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z" fill="rgba(255,215,0,0.75)" /></svg>
                  <span style={{
                    fontSize: "11px", fontWeight: "700",
                    color: "rgba(255,215,0,0.78)", letterSpacing: "0.8px",
                  }}>ঈদ সালামি পাঠান</span>
                  <svg width="9" height="9" viewBox="0 0 12 12"><path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z" fill="rgba(255,215,0,0.75)" /></svg>
                </div>

                {/* Scan note */}
                <p style={{
                  margin: "13px 0 0", fontSize: "9px",
                  color: "rgba(255,255,255,0.2)", letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}>
                  bKash App দিয়ে স্ক্যান করুন
                </p>
              </div>
            </div>

            {/* ── BOTTOM GOLD BAR ── */}
            <div style={{
              height: "6px",
              background: "linear-gradient(90deg, transparent 0%, #6b4f00 10%, #FFD700 30%, #FFFACD 50%, #FFD700 70%, #6b4f00 90%, transparent 100%)",
            }} />
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