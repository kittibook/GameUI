import { motion } from "motion/react";


type Props = {
    startGame: () => void;
  };

export default function InfoGameDraw(prop : Props) {
    const { startGame } = prop
    return (
        <motion.div
        className="overlay flex justify-center bg-gradient-to-r from-indigo-100 to-purple-100 w-full min-h-screen pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="particle">🟠</div>
        <div className="particle">🟣</div>
        <div className="particle">🟡</div>
        <div className="particle floating-card"></div>
        <div className="particle floating-card"></div>

        <motion.div
          className="instructions"
          initial={{ scale: 0.7, opacity: 0, rotateX: 20 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2
            className="font-mali text-4xl md:text-5xl font-bold text-black mb-8 drop-shadow-2xl flex justify-center items-center"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            🎨 เกมวาดรูปหกเหลี่ยม!
          </motion.h2>
          <motion.p
            className="font-mali text-xl md:text-2xl text-black mb-8 leading-relaxed"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            ทดสอบความจำของคุณด้วยการวาดรูปหกเหลี่ยมให้สมบูรณ์!
            <br />
            พร้อมแล้วหรือยัง? มาวาดไปด้วยกันเลย!
          </motion.p>
          <motion.ul
            className="font-mali text-lg md:text-xl text-black list-disc list-inside mb-10 space-y-3"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          ></motion.ul>
          <motion.div
            className="flex justify-center items-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: -3 }}
              whileTap={{ scale: 0.9 }}
              onClick={startGame}
              className="cursor-pointer mt-10 flex justify-center items-center"
            >
              <motion.img
                className="drop-shadow-lg w-32 sm:w-40 md:w-48 px-4 py-2 rounded-lg"
                src="/images/Startgame.png"
                alt="Start Button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    )
}