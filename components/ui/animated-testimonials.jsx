import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export const AnimatedTestimonials = ({
  testimonials,
  isLoading,
  autoplay = false,
}) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (autoplay && testimonials?.length > 1) {
      const interval = setInterval(() => {
        setActive((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, testimonials?.length]);

  if (isLoading) return <p className="text-center text-gray-500">Loading testimonials...</p>;

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="sm:px-[10vw] px-[5vw] lg:py-12 md:py-8 py-6"
    >
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-xl md:text-5xl font-bold"
      >
        Learner Experiences That Speak for Themselves!
      </motion.h2>

      <div className="max-w-xs md:max-w-4xl md:px-8 lg:px-12 lg:py-12 md:py-8 py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          {/* Image Animation (kept as is) */}
          <div className="relative md:h-80 h-40 w-full">
            <AnimatePresence mode="wait">
              {testimonials.map((testimonial, index) => (
                index === active && (
                  <motion.div
                    key={testimonial._id}
                    initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={testimonial.user.imageURL}
                      alt={testimonial.user.name}
                      width={300}
                      height={300}
                      draggable={false}
                      className="md:h-72 md:w-72 h-40 w-40 rounded-full object-cover object-top"
                    />
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>

          {/* Testimonial Text Animation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center space-y-4"
          >
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="md:text-lg text-sm font-bold">{testimonials[active].user.name}</h3>
              <p className="text-sm text-gray-500">{testimonials[active].user.country}</p>
              <p className="mt-4 text-gray-700 leading-loose">
                {testimonials[active].comment}
              </p>
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                onClick={handlePrev}
                aria-label="Previous Testimonial"
                className="h-10 w-10 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center transition-all hover:scale-110"
              >
                <IconArrowLeft className="h-6 w-6 text-gray-600 dark:text-neutral-400" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Testimonial"
                className="h-10 w-10 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center transition-all hover:scale-110"
              >
                <IconArrowRight className="h-6 w-6 text-gray-600 dark:text-neutral-400" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};