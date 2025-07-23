"use client";
import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
export default function ActiveUsersCounter() {
    const [userCount, setUserCount] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    useEffect(() => {
        // Generate a random initial count between 50000 and 60000
        const initialCount = Math.floor(Math.random() * 10000) + 50000;
        setUserCount(initialCount);
        // Update the counter periodically to simulate live data
        const interval = setInterval(() => {
            // Random fluctuation between -50 and +100 users
            const fluctuation = Math.floor(Math.random() * 150) - 50;
            setUserCount((prevCount) => {
                // Keep the count within our 50000-60000 range
                const newCount = prevCount + fluctuation;
                if (newCount < 50000)
                    return 50000;
                if (newCount > 60000)
                    return 60000;
                return newCount;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);
    return (<AnimatePresence>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="fixed bottom-5 left-5 z-50">
        <motion.div className="bg-black border border-orange-500 rounded-full shadow-lg shadow-orange-500/20 cursor-pointer" whileHover={{ scale: 1.05 }} onClick={() => setIsExpanded(!isExpanded)}>
          <motion.div className="flex items-center px-3 py-2.5" layout>
            <motion.div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/20" animate={{
            scale: [1, 1.1, 1],
            transition: { repeat: Infinity, duration: 2 }
        }}>
              <Users className="w-4 h-4 text-orange-500"/>
            </motion.div>
            
            {isExpanded && (<motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="ml-2 text-white font-medium whitespace-nowrap overflow-hidden">
                <span className="text-orange-500 font-bold">{userCount.toLocaleString()}</span>
                <span className="text-xs ml-1 text-gray-400">active users</span>
              </motion.div>)}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>);
}
