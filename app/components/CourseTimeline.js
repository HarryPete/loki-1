import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const stages = [
  {
    title: "Build the Foundation",
    description:
      "Understand the basics of compliance, AML, and sanctions frameworks. Study key principles, terminologies, and regulatory bodies like FATF, OFAC, and EU laws.",
    icon: "📊",
  },
  {
    title: "Deep Dive into Regulations and Risks",
    description:
      "Explore AML laws, sanctions compliance programs, risk assessment strategies, money laundering typologies, and sanctions evasion tactics through detailed study.",
    icon: "⚙️",
  },
  {
    title: "Practical Application and Testing",
    description:
      "Engage in case studies, quizzes, and scenarios to apply knowledge. Practice compliance measures, risk mitigation strategies, and take initial mock tests.",
    icon: "🔨",
  },
  {
    title: "Initial Mock Tests and Analysis",
    description:
      "Take one full-length mock test per week for both CAMS and CGSS. Analyze performance, identify weak areas, and revise key topics to build confidence.",
    icon: "🚀",
  },
  {
    title: "Advanced Mock Tests and Refinement",
    description:
      "Take two full-length mock tests per week for each certification. Focus on high-weightage topics, refine time management, and ensure consistent performance.",
    icon: "🔄",
  },
];

const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const CourseTimeline = () => {
  const [activeIndex, setActiveIndex] = useState(-1);

  // Auto-animation logic
  const startAnimation = useCallback(() => {
    let index = -1;
    return setInterval(() => {
      index = (index + 1) % (stages.length + 1);
      setActiveIndex(index === stages.length ? -1 : index);
    }, 2500);
  }, []);

  useEffect(() => {
    const interval = startAnimation();
    return () => clearInterval(interval);
  }, [startAnimation]);

  return (
    <div className="sm:px-[10vw] px-[5vw] lg:py-12 md:py-8 py-6">
      <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={headingVariants}
              className="text-xl md:text-5xl font-bold lg:pb-12 md:pb-8 pb-6"
            >
        Learning Journey at a Glance!
      </motion.h2>

      <div className="relative grid md:grid-cols-3 grid-cols-1 gap-6">
        {stages.map((stage, index) => (
          <motion.div
            key={index}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(-1)}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            animate={{
              scale: activeIndex === index ? 1.05 : 1,
            }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-xl leading-loose shadow-xl bg-white cursor-pointer transition-all"
          >
            {/* Animated Icon */}
            <motion.div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
              initial={{ scale: 1 }}
              animate={{
                scale: activeIndex === index ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundImage:
                  activeIndex === index
                    ? "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)"
                    : "none",
              }}
            >
              {stage.icon}
            </motion.div>

            {/* Title & Description */}
            <div className="mt-4">
              <h3 className="font-semibold">{stage.title}</h3>
              <motion.p
                className="mt-2"
                initial={{ opacity: 0.5 }}
                animate={{
                  opacity: activeIndex === index ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              >
                {stage.description}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CourseTimeline;