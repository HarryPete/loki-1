import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Plus, Minus } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const faqs = [
    {
      question: "What is CAMS certification?",
      answer: "CAMS (Certified Anti-Money Laundering Specialist) is the global gold standard in AML certifications. It demonstrates your ability to detect and prevent money laundering and terrorist financing activities. The certification is awarded by ACAMS (Association of Certified Anti-Money Laundering Specialists).",
      category: "CAMS"
    },
    {
      question: "What are the CAMS exam requirements?",
      answer: "To qualify for the CAMS exam, you need: a bachelor's degree and 40 qualifying credits from work experience, or 3 years of relevant work experience in financial crime prevention. The exam consists of 120 multiple-choice questions to be completed in 3.5 hours.",
      category: "CAMS"
    },
    {
      question: "How much does CAMS certification cost?",
      answer: "CAMS certification costs include ACAMS membership ($295) and the CAMS Package ($1,695). This includes the exam fee, study materials, and one year of ACAMS membership. Prices may vary by region and promotional offers.",
      category: "CAMS"
    },
    {
      question: "What is CGSS certification?",
      answer: "CGSS (Certified Global Sanctions Specialist) is a professional certification that demonstrates expertise in global sanctions compliance. It focuses on sanctions screening, risk assessment, and regulatory requirements across different jurisdictions.",
      category: "CGSS"
    }
  ];

  const categories = [...new Set(faqs.map(faq => faq.category))];
  const filteredFaqs = selectedCategory ? faqs.filter(faq => faq.category === selectedCategory) : faqs;

  return (
    <motion.div 
      className="md:px-[10vw] px-[5vw] lg:py-12 md:py-8 py-6"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Heading Animation */}
      <motion.h2
        className="text-xl md:text-5xl font-bold pb-12"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Frequently Asked Questions
      </motion.h2>

      {/* Category Pills */}
      <motion.div 
        className="flex flex-wrap gap-2 mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <span
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
            selectedCategory === null 
              ? 'text-white bg-gray-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </span>
        {categories.map((category) => (
          <span
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full md:text-sm text-xs font-medium transition-all duration-300 cursor-pointer ${
              selectedCategory === category 
                ? 'text-white bg-gray-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </span>
        ))}
      </motion.div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={index}
              className={`border border-gray-200 rounded-xl overflow-hidden bg-white transition-all duration-300 ${isOpen ? 'shadow-lg' : 'hover:shadow-md'}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 transition-colors duration-300 bg-white"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                  </div>
                  <h3 className={`font-semibold md:text-base text-sm transition-colors duration-300 ${isOpen ? '' : 'text-gray-900'}`}>
                    {faq.question}
                  </h3>
                </div>
                <ChevronDown className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'text-gray-400'}`} />
              </button>
              
              <div 
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: isOpen ? '200px' : '0', opacity: isOpen ? 1 : 0 }}
              >
                <div className="p-6 pt-0 text-gray-600 bg-gradient-to-b leading-loose from-gray-50 to-white">
                  {faq.answer}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FAQ;