"use client";
import { motion } from "framer-motion";
import { Building2, User, X } from "lucide-react";
export default function UserTypeModal({ isOpen, onClose, onSelectUserType, userProfile }) {
    if (!isOpen)
        return null;
    const isVerifiedBuilder = userProfile === null || userProfile === void 0 ? void 0 : userProfile.isBuilder;
    return (<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-full text-black bg-gray-100 ">
          <X className="w-5 h-5"/>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Choose Listing Type
          </h2>
          <p className="text-gray-600">
            What would you like to post today?
          </p>
        </div>

        <div className="space-y-4">
          {/* Individual Property Option */}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onSelectUserType('individual')} className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-orange-500 transition-colors group">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                <User className="w-6 h-6 text-orange-600"/>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">
                  Individual Property
                </h3>
                <p className="text-gray-600 text-sm">
                  List your personal property for sale or rent
                </p>
              </div>
            </div>
          </motion.button>

          {/* Builder Project Option */}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onSelectUserType('builder')} disabled={!isVerifiedBuilder} className={`w-full p-6 border-2 rounded-xl transition-colors group relative ${isVerifiedBuilder
            ? 'border-gray-200 hover:border-orange-500'
            : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'}`}>
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full transition-colors ${isVerifiedBuilder
            ? 'bg-blue-100 group-hover:bg-blue-200'
            : 'bg-gray-200'}`}>
                <Building2 className={`w-6 h-6 ${isVerifiedBuilder ? 'text-blue-600' : 'text-gray-400'}`}/>
              </div>
              <div className="text-left flex-1">
                <h3 className={`text-lg font-semibold ${isVerifiedBuilder ? 'text-gray-900' : 'text-gray-500'}`}>
                  Builder Project
                </h3>
                <p className={`text-sm ${isVerifiedBuilder ? 'text-gray-600' : 'text-gray-400'}`}>
                  {isVerifiedBuilder
            ? 'Post a development project as a verified builder'
            : 'Requires builder verification'}
                </p>
              </div>
              {!isVerifiedBuilder && (<div className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                  Verification Required
                </div>)}
            </div>
          </motion.button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          {!isVerifiedBuilder ? (<div className="text-center">
              <p className="text-xs text-gray-500 mb-2">
                Want to post builder projects? 
              </p>
              <p className="text-xs text-orange-600 font-medium">
                Complete your builder verification first
              </p>
            </div>) : (<p className="text-xs text-gray-500 text-center">
              Make sure you have the appropriate permissions and documentation for your listing type
            </p>)}
        </div>
      </motion.div>
    </div>);
}
