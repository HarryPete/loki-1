import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { motion } from "framer-motion";

const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const CourseBenefits = () => 
{
    const cards = data.map((card, index) => 
    (
      <motion.div
      key={card.src}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card card={card} index={index} />
      </motion.div>
    ));

  return (
    <div className="w-full h-full lg:py-12 md:py-8 py-6">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={headingVariants}
        className="text-xl md:text-5xl md:px-[10vw] px-[5vw] font-bold"
      >
        Comprehensive Learning with Exclusive Benefits
      </motion.h2>
      <Carousel items={cards} />
    </div>
  );
};

export default CourseBenefits

const data = [
  {
    category: "Live classes ",
    title: "Learn directly from expert instructors.",
    src: "https://images.unsplash.com/photo-1627470094296-6abfd2e9f664?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    category: "Study materials",
    title: "Access curated notes and resources.",
    src: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    category: "Recorded sessions",
    title: "Revisit lessons anytime, anywhere.",
    src: "https://images.unsplash.com/photo-1613870948964-7125fa3e1aab?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    category: "Mock tests",
    title: "Practice with real exam simulations.",
    src: "https://images.unsplash.com/photo-1522071901873-411886a10004?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    category: "Forum",
    title: "Engage, discuss, and clarify.",
    src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    category: "1:1 sessions",
    title: "Expert guidance to clear your doubts.",
    src: "https://plus.unsplash.com/premium_photo-1682608389253-7a160b4c86a1?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
