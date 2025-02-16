"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BatchCard from "@/app/components/BatchCard";
import Loading from "@/app/components/Loading";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import BatchForm from "@/app/components/BatchForm";
import { motion, AnimatePresence } from "framer-motion";

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newBatch, setNewBatch] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getBatches();
  }, []);
  

  const getBatches = async () => {
    try {
      const url = `/api/batch`;
      const response = await axios.get(url);
      console.log(response)
      const sortedBatches = response.data.sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      );
      setBatches(sortedBatches);
    } catch (error) {
      toast(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeBatch = async (id) => {
    try {
      const url = `/api/batch/${id}`;
      await axios.delete(url);
      setBatches((prevBatches) => prevBatches.filter((batch) => batch._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <BatchForm newBatch={newBatch} setNewBatch={setNewBatch} getBatches={getBatches} />

      <motion.div 
        className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
      >
        <AnimatePresence>
          {batches.map((batch) => (
            <motion.div
              key={batch._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
                exit: { opacity: 0, scale: 0.9 },
              }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <BatchCard type="batch" level="admin" batch={batch} removeBatch={removeBatch} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Batches;
