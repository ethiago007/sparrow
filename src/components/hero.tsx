import darkBg from "/darkH.jpg";
import "../App.css";

const HeroSection = () => {
  return (
    <section
      className="hero-section relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${darkBg})`,
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 pt-[20vh] ">
        {/* Text Content */}
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-4xl md:text-4xl font-bold mb-6 text-white">
            From <span className="text-white">Overwhelming PDFs</span> to
            <span className="block mt-2 sm:mt-3 text-white">
              AI-Powered One-Page Summaries
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-lg mb-8 mx-auto text-white/90 max-w-2xl">
            Drowning in lecture slides? Upload any PDF and get a concise,
            <span className="font-semibold"> AI-generated summary</span> —
            perfect for last-minute studying or research.
          </p>

          {/* Buttons */}
          <div className="flex justify-center">
            <button className="bg-white text-black hover:bg-white-900 px-6 py-3 rounded-full font-medium transition-colors text-base shadow-sm hover:shadow-md cursor-pointer active:scale-95">
              Start Summarizing
            </button>
          </div>
        </div>

        {/* Demo Preview - Stacked on mobile */}
        {/* <div className="mt-10 sm:mt-16 w-full max-w-3xl px-4">
          <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-md border border-gray-300">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-bold text-gray-600 mb-2 text-sm sm:text-base">Input PDF</h3>
                <p className="text-xs sm:text-sm text-gray-500">50-page_biology_lecture.pdf</p>
              </div>
              <div className="w-full sm:w-1/2 p-4 bg-black/5 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">AI Summary</h3>
                <p className="text-xs sm:text-sm text-gray-700">3 key concepts extracted...</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default HeroSection;
