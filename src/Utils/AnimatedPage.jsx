import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, filter: 'blur(10px)' },
  in: { opacity: 1, filter: 'blur(0px)' },
  out: { opacity: 0, filter: 'blur(10px)' },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.4,
};



export default function AnimatedPage({ children }) {
  return (
    <div className='div__content'>
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >

        {children}
      </motion.div>
    </div>
  );
}