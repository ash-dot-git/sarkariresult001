"use client";

import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { motion, AnimatePresence } from "framer-motion";
import Template1 from "./templates/Template1";
import Template2 from "./templates/Template2";
import Template3 from "./templates/Template3";


export default function PosterGenerator({ postId, titleSlug }) {
  const [modalStep, setModalStep] = useState(0);
  const [cyberName, setCyberName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("template1");
  const [showAd, setShowAd] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [form, setForm] = useState(null);
  const posterRef = useRef(null);


  const TemplateComponent = {
    template1: Template1,
    template2: Template2,
    template3: Template3,
  }[selectedTemplate];

  // Fetch poster details
  useEffect(() => {
    const loadPoster = async () => {
      if (!postId) return;
      try {
        const res = await fetch(`/api/v0/get-poster-details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ srvc: "fetch poster details", data: { postId } }),
        });
        const json = await res.json();
        setForm(json?.stat && json?.data ? json?.data : null);
      } catch (e) {
        console.warn("⚠️ Failed to load poster details:", e);
        setForm(null);
      }
    };
    loadPoster();
  }, [postId]);

  const openModal = () => setModalStep(1);

  const handleNameSubmit = () => setModalStep(2);

  const handleDownloadWithAd = async () => {
    setShowAd(true);

    // Wait for ad timer
    await new Promise((r) => setTimeout(r, 5000));
    setShowAd(false);

    await generatePoster();

    // Reset modal and states after download
    setModalStep(0);
    setCyberName("");
    setSelectedTemplate("template1");
    setForm(null); // optional: if you want modal content fully cleared
  };

  const generatePoster = async () => {
    const poster = posterRef.current;
    if (!poster) return;
    setDownloading(true);

    // Clone the poster to avoid messing with DOM
    const posterClone = poster.cloneNode(true);
    posterClone.style.position = "absolute";
    posterClone.style.left = "0";
    posterClone.style.top = "0";
    posterClone.style.width = "auto";
    posterClone.style.height = "auto";
    posterClone.style.overflow = "visible";
    posterClone.style.zIndex = "9999";

    document.body.appendChild(posterClone);

    try {
      const canvas = await html2canvas(posterClone, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${form?.title}_poster${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error("Failed to generate poster:", err);
    } finally {
      // Remove the clone from DOM
      posterClone.remove();
      setDownloading(false);
    }
  };

  const handleCancel = () => {
    setModalStep(0);
    setCyberName("");
    setSelectedTemplate("template1");
  };

  // Do not render anything if no form
  if (!form) return null;

  return (
    <>

      {/* Inline-ready Generate Poster Button */}
      <button
        onClick={openModal}
        disabled={!form} // disable until form is loaded
        className={`bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-700 transition ${!form ? "opacity-50 cursor-not-allowed" : ""
          }`}
      >
        Generate Poster
      </button>

      {/* Modal */}
      <AnimatePresence>
        {modalStep > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Template Switch */}
              {modalStep === 2 && (
                <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex flex-wrap gap-3 justify-center">
                  {["template1", "template2", "template3"].map((t) => (
                    <button
                      key={t}
                      className={`px-4 py-2 rounded-lg text-sm border transition ${selectedTemplate === t
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white hover:bg-gray-100 border-gray-300"
                        }`}
                      onClick={() => setSelectedTemplate(t)}
                    >
                      {t.replace("template", "Template ")}
                    </button>
                  ))}
                </div>
              )}

              {/* Modal Content */}
              <div className="flex-1 overflow-auto p-6">
                {modalStep === 1 && (
                  <div className="flex flex-col items-center gap-4">
                    <h3 className="text-xl font-semibold text-gray-800">Enter Cyber Cafe Name</h3>
                    <input
                      type="text"
                      value={cyberName}
                      onChange={(e) => setCyberName(e.target.value)}
                      placeholder="e.g. Cyber Cafe, Your State"
                      className="w-full max-w-md border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {modalStep === 2 && (
                  <div
                    ref={posterRef}
                    id="poster-preview"
                    className="border rounded-lg p-6 bg-white flex flex-col items-center shadow-inner"
                    style={{ overflow: "visible", maxHeight: "none", height: "auto", transform: "none", margin: "0 auto", display: "block" }}
                  >
                    <TemplateComponent
                      orgName={form.organization}
                      postTitle={form.title}
                      startDate={form.dates.start}
                      endDate={form.dates.end}
                      totalPosts={form.totalPosts}
                      qualification={form.qualification}
                      location={form.location}
                      cyberName={cyberName}
                      whatsappLink="https://whatsapp.com/channel/0029VbBYkKeATRSvPfHLEx2N"
                      articleLink={`https://newsarkariresult.co.in/${titleSlug}`}
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t sticky bottom-0 bg-white z-10 px-6 py-4 flex flex-wrap justify-center gap-4">
                {modalStep === 1 && (
                  <>
                    <button onClick={handleNameSubmit} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                      Continue
                    </button>
                    <button onClick={handleCancel} className="bg-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 transition">
                      Cancel
                    </button>
                  </>
                )}
                {modalStep === 2 && (
                  <>
                    <button onClick={handleDownloadWithAd} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex-1 min-w-[120px]">
                      {downloading ? "Generating..." : "Download Poster"}
                    </button>
                    <button onClick={handleCancel} className="bg-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 transition flex-1 min-w-[120px]">
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ad Placeholder */}
      <AnimatePresence>
        {showAd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center max-w-sm">
              <p className="text-lg font-semibold mb-2">Advertisement</p>
              <p className="text-gray-600">Your poster will download in 5 seconds...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
