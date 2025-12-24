import { TypeAnimation } from "react-type-animation";
import { motion } from "motion/react";

const Speech = () => {
  return (
    <motion.div
      className="bubbleContainer"
      animate={{ opacity: [0, 1] }}
      transition={{ duration: 1 }}
    >
      <div className="bubble">
        <TypeAnimation
          sequence={[
            1000,
            "Passionate dancer specializing in Salsa, Bollywood & Aerial acts",
            1000,
            "Semi-finalist of India's Got Talent & Ugram Ujwalam",
            1000,
            "Teaching dance forms & performing globally",
            1000,
          ]}
          wrapper="span"
          speed={40}
          deletionSpeed={60}
          repeat={Infinity}
        />
      </div>
      <img src={`${import.meta.env.BASE_URL}man.png`} alt="" />
    </motion.div>
  );
};

export default Speech;
