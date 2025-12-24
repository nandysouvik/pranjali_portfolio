import { useEffect, useRef, useState } from "react";
import "./portfolio.css";
import { motion, useInView, useScroll, useTransform } from "motion/react";

const items = [
  {
    id: 1,
    img: `${import.meta.env.BASE_URL}p1.png`,
    title: "India's Got Talent - Semi-Finalist",
    desc: "Achieved semi-finalist position in India's Got Talent (Colors TV), showcasing exceptional dance talent and performance skills on a national platform.",
    link: "https://youtu.be/ciEwiGbDvus",
  },
  {
    id: 2,
    img: "",
    title: "Ugram Ujwalam - Semi-Finalist",
    desc: "Reached semi-finals in 'Ugram Ujwalam' (Manorama TV), demonstrating versatility in dance forms and captivating performances.",
  },
  {
    id: 3,
    title: "Mauritius National Day Performance",
    desc: "Performed at prestigious Mauritius National Day event, telecasted on the national channel of Mauritius, representing Indian dance culture internationally.",
  },
  {
    id: 4,
    title: "ETV @ 20 Showcase",
    desc: "Participated in 'ETV @ 20' showcase event, telecasted on ETV Telugu, showcasing Bollywood and contemporary dance performances.",
    link: "https://youtu.be/fakxHZTcS8k",
  },
  {
    id: 5,
    title: "Dance Instruction & Teaching",
    desc: "Teaching Aerial Pole act, contemporary Bollywood & Hip hop at Dancepiration Academy, and semi-classical & contemporary dance forms at Name Academy as freelance instructor.",
  },
];

const imgVariants = {
  initial: {
    x: -500,
    y: 500,
    opacity: 0,
  },
  animate: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const textVariants = {
  initial: {
    x: 500,
    y: 500,
    opacity: 0,
  },
  animate: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      staggerChildren: 0.05,
    },
  },
};

const ListItem = ({ item }) => {
  const ref = useRef();

  const isInView = useInView(ref, { margin: "-100px" });

  const hasImage = item.img && item.img.trim() !== "";
  const hasLink = item.link && item.link.trim() !== "";

  return (
    <div className="pItem" ref={ref}>
      {hasImage && (
        <motion.div
          variants={imgVariants}
          animate={isInView ? "animate" : "initial"}
          className="pImg"
        >
          <img src={item.img} alt="" />
        </motion.div>
      )}
      <motion.div
        variants={textVariants}
        animate={isInView ? "animate" : "initial"}
        className="pText"
        style={!hasImage ? { width: "80%", margin: "0 auto" } : {}}
      >
        <motion.h1 variants={textVariants}>{item.title}</motion.h1>
        <motion.p variants={textVariants}>{item.desc}</motion.p>
        {hasLink && (
          <motion.a variants={textVariants} href={item.link} target="_blank" rel="noopener noreferrer">
            <button>{item.link !== "/" ? "Watch Performance" : "Learn More"}</button>
          </motion.a>
        )}
      </motion.div>
    </div>
  );
};

const Portfolio = () => {
  const [containerDistance, setContainerDistance] = useState(0);
  const ref = useRef(null);

  // useEffect(() => {
  //   if (ref.current) {
  //     const rect = ref.current.getBoundingClientRect();
  //     setContainerDistance(rect.left);
  //   }
  // }, []);

  // FIX: Re-calculate when screen size changes
  useEffect(() => {
    const calculateDistance = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setContainerDistance(rect.left);
      }
    };

    calculateDistance();

    window.addEventListener("resize", calculateDistance);

    return () => {
      window.removeEventListener("resize", calculateDistance);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: ref });

  const xTranslate = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -window.innerWidth * items.length]
  );

  return (
    <div className="portfolio" ref={ref}>
      <motion.div className="pList" style={{ x: xTranslate }}>
        <div
          className="empty"
          style={{
            width: window.innerWidth - containerDistance,
            // backgroundColor: "pink",
          }}
        />
        {items.map((item) => (
          <ListItem item={item} key={item.id} />
        ))}
      </motion.div>
      <section />
      <section />
      <section />
      <section />
      <section />
      <div className="pProgress">
        <svg width="100%" height="100%" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#ddd"
            strokeWidth={20}
          />
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#dd4c62"
            strokeWidth={20}
            style={{ pathLength: scrollYProgress }}
            transform="rotate(-90 80 80)"
          />
        </svg>
      </div>
    </div>
  );
};

export default Portfolio;
