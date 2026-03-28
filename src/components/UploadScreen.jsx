import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, FileSpreadsheet, FileBox, ShieldCheck, Zap, Activity } from 'lucide-react';

export default function UploadScreen({ onFileSelect, isStandalone = false }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  });

  return (
    <div className={`flex flex-col items-center justify-center ${isStandalone ? 'p-2' : 'min-h-screen p-6'} relative overflow-hidden w-full transition-colors duration-200`}>
      
      {!isStandalone && (
        <>
          {/* Premium subtle background base */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-primary-100 dark:bg-slate-950 transition-colors duration-200">
            
            {/* Subtle Noise Texture Overlay */}
            <div 
              className="absolute inset-0 z-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
            />
          </div>

          <div className="max-w-3xl w-full text-center mb-12 animate-fade-in-up">
            {/* Vibrant Gem FinSight Logo */}
            <div className="flex items-center justify-center space-x-3 mb-8 group">
              <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl transform transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300">
                <path d="M32 4L56 32L32 60L8 32Z" fill="url(#facet_main)" />
                <path d="M32 4L56 32L32 32Z" fill="url(#facet_right)" />
                <path d="M32 4L8 32L32 32Z" fill="url(#facet_left)" />
                <path d="M8 32L32 60L32 32Z" fill="url(#facet_bottom_left)" />
                <path d="M56 32L32 60L32 32Z" fill="url(#facet_bottom_right)" />
                <circle cx="32" cy="22" r="5" fill="#ffffff" className="animate-pulse" />
                
                <defs>
                  <radialGradient id="bg_glow" cx="0.5" cy="0.5" r="0.5">
                    <stop stopColor="#ec4899" />
                    <stop offset="1" stopColor="#3b82f6" stopOpacity="0"/>
                  </radialGradient>
                  <linearGradient id="facet_main" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#f43f5e" /><stop offset="1" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="facet_left" x1="8" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#f43f5e" /><stop offset="1" stopColor="#e11d48" />
                  </linearGradient>
                  <linearGradient id="facet_right" x1="32" y1="4" x2="56" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#8b5cf6" /><stop offset="1" stopColor="#6366f1" />
                  </linearGradient>
                  <linearGradient id="facet_bottom_left" x1="8" y1="32" x2="32" y2="60" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fb923c" /><stop offset="1" stopColor="#f97316" />
                  </linearGradient>
                  <linearGradient id="facet_bottom_right" x1="32" y1="32" x2="56" y2="60" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3b82f6" /><stop offset="1" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 transition-colors duration-200">
                Fin<span className="text-rose-500">S</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-blue-500">ight</span>
              </span>
            </div>

            <div className="inline-flex items-center space-x-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 mb-6 shadow-sm transition-colors duration-200">
              <ShieldCheck className="w-4 h-4 text-success-500 dark:text-success-400" />
              <span>100% Private. No Data Stored.</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight mb-6 transition-colors duration-200">
              Understand Your Money in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-success-500">Seconds</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto transition-colors duration-200">
              Upload your bank statement and get an instant, beautiful dashboard with all your financial insights — free, private, no signup needed.
            </p>
          </div>
        </>
      )}

      <div 
        {...getRootProps()} 
        className={`w-full max-w-2xl ${isStandalone ? '' : 'glass-panel shadow-xl hover:shadow-2xl'} bg-white dark:bg-slate-900/50 p-12 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center ${isDragActive ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 scale-[1.02]' : 'border-slate-300 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500 hover:scale-[1.01]'}`}
      >
        <input {...getInputProps()} />
        
        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/50 dark:to-primary-900/20 rounded-full flex items-center justify-center mb-6 shadow-inner transition-colors">
          <UploadCloud className={`w-10 h-10 transition-transform ${isDragActive ? 'text-primary-600 scale-110' : 'text-primary-500'}`} />
        </div>
        
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2 transition-colors">
          {isDragActive ? "Drop statement here..." : "Drag & Drop your statement"}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-8 transition-colors">or click to browse files from your device</p>

        <div className="flex items-center justify-center space-x-6 text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-danger-500 dark:text-danger-400" />
            <span>PDF</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-success-500 dark:text-success-400" />
            <span>XLSX / CSV</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileBox className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            <span>TXT</span>
          </div>
        </div>
      </div>

      {!isStandalone && (
        <>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full text-center">
            <div className="p-4 transform hover:-translate-y-1 transition duration-300">
              <div className="mx-auto w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center mb-4 text-primary-500 transition-colors">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 transition-colors">Instant Insights</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">AI automatically reads and organizes your transactions in seconds.</p>
            </div>
            <div className="p-4 transform hover:-translate-y-1 transition duration-300">
              <div className="mx-auto w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center mb-4 text-primary-500 transition-colors">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 transition-colors">Visual Trends</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">Easily see where your money goes with beautiful charts and tables.</p>
            </div>
            <div className="p-4 transform hover:-translate-y-1 transition duration-300">
              <div className="mx-auto w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center mb-4 text-primary-500 transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 transition-colors">100% Private</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">No backend servers. Everything runs locally in your browser.</p>
            </div>
          </div>

          <footer className="absolute bottom-6 text-xs text-slate-400 dark:text-slate-500 font-medium transition-colors">
            Free forever. No signup. No data stored.
          </footer>
        </>
      )}
    </div>
  );
}
