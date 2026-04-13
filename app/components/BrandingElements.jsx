import {motion} from 'framer-motion';

export function LoadingSpinner() {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-[#EEEEEE] flex items-center justify-center overflow-hidden"
    >
      <div className="relative flex flex-col items-center gap-12">
        {/* CENTERPIECE LOGO ANIMATION */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter text-[#121212] select-none">
            Loorea
          </h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
            className="absolute -bottom-4 left-0 h-[1px] bg-[#AF1E15]"
          />
        </motion.div>

        {/* LOADING STATUS */}
        <div className="overflow-hidden">
          <motion.span 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 1, ease: "easeOut" }}
            className="block text-[9px] uppercase tracking-[0.6em] text-[#121212]/30 font-medium"
          >
            Entering Atelier
          </motion.span>
        </div>
      </div>

      {/* BACKGROUND DECORATIVE ELEMENTS */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ duration: 3 }}
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
      >
        <span className="text-[40vw] font-serif font-black italic tracking-tighter select-none">
          L
        </span>
      </motion.div>
    </motion.div>
  );
}

export function VerticalBrandAnchor() {
  return (
    <div className="fixed left-0 top-0 bottom-0 w-12 md:w-16 z-[45] hidden lg:flex flex-col items-center justify-between py-12 border-r border-[#121212]/5 pointer-events-none">
      <div className="h-12 w-[1px] bg-[#AF1E15]" />
      
      <div className="rotate-180 [writing-mode:vertical-lr] flex items-center gap-8">
        <span className="text-[9px] uppercase tracking-[0.8em] text-[#121212]/20 font-medium whitespace-nowrap">
          LOOREA JEWELLERY — ARCHIVE 2024
        </span>
        <div className="w-[1px] h-12 bg-[#121212]/10" />
        <span className="text-[9px] uppercase tracking-[0.8em] text-[#121212]/40 font-bold whitespace-nowrap">
          ESTONIAN FILIGREE
        </span>
      </div>

      <div className="h-12 w-[1px] bg-[#AF1E15]" />
    </div>
  );
}
