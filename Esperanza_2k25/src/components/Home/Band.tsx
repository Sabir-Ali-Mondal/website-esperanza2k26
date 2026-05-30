"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchAllBands } from "@/actions/fetch.action";
import bandataglance from "@/assets/images/BANDATAGLANCE.png";

interface BandType {
  _id: string;
  title: string;
  imageUrl: string;
  description?: string;
}

const Band = () => {
  const [bands, setBands] = useState<BandType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBands = async () => {
      const data = await fetchAllBands();
      setBands(data);
      setLoading(false);
    };
    loadBands();
  }, []);

  return (
    <div className="items-center justify-center">
      <div className="absolute w-full items-center justify-center right-[-21%]">
        <div className="bg-gray-200 w-[30%] h-[100%] absolute bottom-1 right-[8%]" />
        <Image src={bandataglance} alt="" className="w-[60%]" />
        <div className="bg-gray-200 w-[30%] h-[100%] absolute bottom-1 right-[102%]" />
      </div>
      <div className="mt-10 md:mt-50 relative">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse text-gray-500 text-xl">Loading bands...</div>
          </div>
        ) : bands.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No bands yet. Check back soon!</div>
        ) : (
          <div className="space-y-8">
            {bands.map((bandItem) => (
              <div key={bandItem._id} className="relative">
                <Image
                  src={bandItem.imageUrl}
                  alt={bandItem.title}
                  width={1920}
                  height={1080}
                  className="w-full h-auto"
                />
                {bandItem.description && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-2xl font-bold text-white">{bandItem.title}</h3>
                    <p className="text-gray-200 mt-2">{bandItem.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="bg-red-600 w-full h-[30%] absolute bottom-0 z-[-1]" />
      </div>
    </div>
  );
};

export default Band;