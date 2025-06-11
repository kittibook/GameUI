"use client";
import { config } from "@/app/Config/config";
import useGame from "@/app/Hook/GameHook/context.hook";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface datasett {
  Dataset_id: number
  dateStart: string
  dateEnd: string
  Name: string
  details: string
  Positionid: number
}

export default function Home() {
  const router = useRouter();
  const [dataSet, setdataSet] = useState('0')
  const [data, setData] = useState<datasett[]>([])
  const context = useGame()

  const { updateDataSet } = context;
  useEffect(() => {
    fechData()
  }, [])

  const fechData = async () => {
    try {
      const response = await fetch(config.url + 'game/dataset', { method: "GET" })
      const dataset = await response.json()
      if (dataset.success) {
        // console.log(dataset)
        setData(dataset.dataSet)
      }
    } catch (error) {

    }
  }

  const submit = () => {
    const number = parseInt(dataSet)
    // console.log(number)
    updateDataSet(number)
    router.push("/information")
  }

  return (
    <div
      className="relative h-screen w-full flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: "url('/images/backgrow.png')",
      }}
    >
      <div className="flex flex-col items-center justify-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-center items-center"
        >
          <motion.select
            value={dataSet}
            onChange={(e) => setdataSet(e.target.value)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="font-mali w-[500px] h-[100px] text-xl border-none text-white text-center bg-transparent cursor-pointer"
            style={{
              backgroundImage: "url('/images/frame.png')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
              outline: "none",
              filter: "drop-shadow(2px 2px 6px rgba(0, 0, 0, 0.3))",
              paddingTop: "7%",
              paddingLeft: "5%",
            }}
          >
            <option value="0" disabled>
              กรุณาเลือกข้อมูลที่ต้องการ
            </option>
            {Array.isArray(data) ? (
              <>
                {data.map((value) => (
                  <option key={value.Name} value={value.Dataset_id}>{value.Name}</option>
                ))}
              </>
            ) : (
              ""
            )}
          </motion.select>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.1, rotate: -3 }}
          whileTap={{ scale: 0.9 }}
          onClick={submit}
          className="cursor-pointer"
        >
          <motion.img
            className="mt-6 drop-shadow-lg"
            src="/images/next.png"
            alt="Next Button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          />
        </motion.button>
      </div>
    </div>
  );
}
