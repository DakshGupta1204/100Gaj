import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop with subtle gradient */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal container */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10 w-full max-w-2xl"
          >
            {/* Modal content with border gradient */}
            <div className="relative group">
              {/* Border gradient effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/30 via-black to-orange-500/30 p-[1px]">
                <div className="absolute inset-0 rounded-xl bg-black/80 backdrop-blur-sm" />
              </div>

              {/* Main content */}
              <div className="relative rounded-xl overflow-hidden bg-gradient-to-b from-black/90 to-black/70 border border-orange-500/20">
                {/* Header with close button */}
                <div className="flex justify-end p-2">
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-full text-gray-300 hover:text-white hover:bg-orange-500/20 transition-colors duration-200"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content area */}
                <div className="p-6 pt-0">
                  {children}
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute -inset-2 rounded-xl bg-orange-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;