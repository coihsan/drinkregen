import React, { useState, useEffect, useRef } from 'react';
import { Leaf, Droplets, Heart, CheckCircle, ChevronDown, ChevronUp, Send, Bot, Sparkles, Scan, Loader2 } from 'lucide-react';
import Image from 'next/image';

// Konfigurasi Firebase (Placeholder untuk kebutuhan masa depan)
// const firebaseConfig = JSON.parse(__firebase_config || '{}');

const App = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Halo! Saya asisten AI Regen. Ada yang ingin kamu tanyakan tentang kampanye "Asli Nol Kalori" atau varian 300ml baru kami?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  const chatEndRef = useRef(null);
  const apiKey = ""; // API Key disediakan oleh environment

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Fungsi pembantu untuk exponential backoff
  const fetchWithRetry = async (url, options, retries = 5, backoff = 1000) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok && retries > 0) throw new Error(response.statusText);
      return response;
    } catch (err) {
      if (retries <= 0) throw err;
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
  };

  const callGemini = async (prompt, isImage = false) => {
    const model = "gemini-2.5-flash-preview-09-2025";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      systemInstruction: {
        parts: [{ text: "Kamu adalah asisten ahli nutrisi untuk brand minuman 'Regen'. Fokus utamamu adalah menjelaskan keunggulan varian 300ml yang menggunakan Glikosida Steviol (pemanis alami dari daun Stevia) dan kampanye 'Asli Nol Kalori'. Gunakan bahasa Indonesia yang santai, mudah dimengerti, dan persuasif namun tetap akurat. Jangan terlalu medis." }]
      }
    };

    try {
      const response = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, saya sedang kesulitan memproses informasi.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Koneksi terputus. Silakan coba lagi nanti.";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput("");
    setIsTyping(true);

    const aiResponse = await callGemini(userMessage);
    setMessages(prev => [...prev, { role: 'bot', text: aiResponse }]);
    setIsTyping(false);
  };

  const analyzeProduct = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    // Simulasi prompt analisis gambar berdasarkan botol orange yang diunggah
    const prompt = "Analisislah botol Regen 300ml rasa Orange ini. Jelaskan apa arti label 'Glikosida Steviol', '0 Kalori', dan 'Tinggi Vitamin C' yang ada di kemasan bagi kesehatan konsumen harian dalam bahasa yang sangat sederhana.";
    
    const result = await callGemini(prompt);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const faqs = [
    {
      q: "Apa yang dimaksud dengan 'Asli Nol Kalori'?",
      a: "Artinya manisnya Regen 300ml berasal dari Glikosida Steviol, pemanis alami dari daun tanaman Stevia. Tubuh tidak menyerapnya sebagai energi (kalori), sehingga tetap manis tanpa bikin berat badan naik."
    },
    {
      q: "Apa bedanya varian 300ml dengan 450ml?",
      a: "Varian 300ml adalah 'The New Face of Regen'. Selain ukurannya yang lebih pas dibawa-bawa, formulanya lebih alami menggunakan Stevia, sedangkan varian 450ml masih menggunakan pemanis buatan (Sukralosa)."
    },
    {
      q: "Apakah aman dikonsumsi setiap hari?",
      a: "Tentu! Karena menggunakan pemanis alami dan nol gula, Regen 300ml dirancang untuk mendukung gaya hidup sehat kamu tanpa rasa khawatir."
    }
  ];

  return (
    <div className="min-h-screen font-sans bg-slate-50 text-gray-800">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter text-blue-600">REGEN<span className="text-green-500">.</span></div>
          <div className="hidden md:flex space-x-8 font-medium text-sm text-gray-600">
            <a href="#tentang" className="hover:text-blue-600 transition">Tentang</a>
            <a href="#asisten" className="hover:text-blue-600 transition">Asisten AI</a>
            <a href="#faq" className="hover:text-blue-600 transition">FAQ</a>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Coba Sekarang
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-20 px-4 bg-gradient-to-b from-blue-50 via-white to-slate-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-green-700 uppercase bg-green-100 rounded-full animate-pulse">
            Inovasi Baru: Stevia Formula
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Segarnya <span className="text-blue-600 italic underline decoration-green-400">Asli</span> <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-emerald-500 to-blue-600">Nol Kalori</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
            Menjawab keinginanmu untuk hidup lebih ringan. Formula baru dengan manis alami daun Stevia, untuk rasa yang tetap enak tanpa rasa bersalah.
          </p>
        </div>
      </header>

      {/* AI Analysis Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-100/50 overflow-hidden border border-gray-100">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-16 flex flex-col justify-center bg-gradient-to-br from-white to-blue-50/30">
                <div className="flex items-center space-x-2 text-blue-600 font-bold mb-4">
                  <Sparkles size={20} />
                  <span>Teknologi Smart-Scan</span>
                </div>
                <h2 className="text-4xl font-bold mb-6">Kenali Lebih Dalam Apa yang Kamu Minum</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Gunakan AI kami untuk menganalisis manfaat di balik label kemasan Regen 300ml. Dari kandungan Vitamin C hingga rahasia manis nol kalori kami.
                </p>
                <button 
                  onClick={analyzeProduct}
                  disabled={isAnalyzing}
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition disabled:opacity-50 group"
                >
                  {isAnalyzing ? <Loader2 className="animate-spin" /> : <Scan className="group-hover:scale-110 transition" />}
                  <span>{isAnalyzing ? 'Menganalisis Kemasan...' : 'Analis Keunggulan Produk'}</span>
                </button>

                {analysisResult && (
                  <div className="mt-8 p-6 bg-green-50 border border-green-100 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h4 className="font-bold text-green-800 mb-2 flex items-center">
                      <Sparkles size={16} className="mr-2" /> Hasil Analisis AI:
                    </h4>
                    <p className="text-sm text-green-700 leading-relaxed italic">
                      "{analysisResult}"
                    </p>
                  </div>
                )}
              </div>
              <div className="bg-slate-100 flex items-center justify-center p-12 relative min-h-[400px]">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-400 rounded-full blur-3xl"></div>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-green-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                  {/* Gambar botol yang diunggah disimulasikan di sini */}
                  <div className="relative bg-white p-4 rounded-2xl shadow-xl">
                    <Image 
                      src="https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=400" 
                      alt="Regen Orange 300ml"
                      className="w-48 md:w-64 h-auto rounded-lg"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/400x600?text=Regen+Orange+300ml";
                      }}
                    />
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/70 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full border border-white/20">
                      Tinggi Vitamin C • 0 Kalori
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chat Assistant Section */}
      <section id="asisten" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Punya Pertanyaan Lain?</h2>
            <p className="text-gray-600">Tanyakan apa saja pada asisten AI kami mengenai diet, stevia, atau tips hidup sehat.</p>
          </div>
          
          <div className="bg-slate-50 border border-slate-200 rounded-[2rem] overflow-hidden flex flex-col h-[500px] shadow-inner">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}>
                    {msg.role === 'bot' && <Bot size={16} className="mb-2 opacity-50" />}
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex space-x-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Tanya tentang Stevia atau Diet..."
                className="flex-1 bg-slate-100 border-none rounded-xl px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button 
                type="submit"
                disabled={isTyping}
                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-blue-600 text-white rounded-t-[4rem]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Informasi Tambahan</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-blue-700/50 rounded-2xl overflow-hidden border border-blue-500/30">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-bold"
                >
                  <span>{faq.q}</span>
                  {openFaq === index ? <ChevronUp /> : <ChevronDown />}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-blue-100 text-sm leading-relaxed animate-in slide-in-from-top-2 duration-300">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-blue-600 text-white border-t border-blue-500/30">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Siap Hidup Lebih Ringan?</h2>
          <button className="bg-white text-blue-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-blue-50 transition shadow-xl mb-12">
            Cari di Toko Terdekat
          </button>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-blue-500/30 text-blue-200 text-sm">
            <p>© 2024 Regen Indonesia. Asli Nol Kalori.</p>
            <div className="flex space-x-6 mt-4 md:mt-0 font-medium">
              <a href="#" className="hover:text-white">Instagram</a>
              <a href="#" className="hover:text-white">TikTok</a>
              <a href="#" className="hover:text-white">Website Utama</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;