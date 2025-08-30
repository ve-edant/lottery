/* eslint-disable */
"use client";

import { useRouter } from "next/navigation";

const games = [
  {
    name: "TB Chess",
    img: "https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/800_20250816142016461.jpeg",
    odds: 96.6,
  },
  {
    name: "Spribe",
    img: "https://ossimg.envyenvelope.com/daman/gamelogo/SPRIBE/22001.png",
    odds: 96.19,
  },
  {
    name: "WinGo",
    img: "https://ossimg.envyenvelope.com/daman/gamelogo/ARLottery/WinGo_30S_20250816142946827.png",
    odds: 96.55,
  },
  {
    name: "Chess 121",
    img: "https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/121.png",
    odds: 96.76,
  },
  {
    name: "JILI 51",
    img: "https://ossimg.envyenvelope.com/daman/gamelogo/JILI/51.png",
    odds: 97.73,
  },
  {
    name: "JILI 109",
    img: "https://ossimg.envyenvelope.com/daman/gamelogo/JILI/109.png",
    odds: 96.44,
  },
];

const lotteryGames = [
  {
    title: "Win Go",
    img: "https://ossimg.envyenvelope.com/daman/lotterycategory/lotterycategory_20240123160120h4kw.png",
    url: "/lottery/win-go"
  },
  {
    title: "MotoRace",
    img: "https://ossimg.envyenvelope.com/daman/lotterycategory/lotterycategory_20250516043207vae6.png",
    url: "/"
  },
  {
    title: "K3",
    img: "https://ossimg.envyenvelope.com/daman/lotterycategory/lotterycategory_20240123160129bev8.png",
    url: "/"

  },
  {
    title: "5D",
    img: "https://ossimg.envyenvelope.com/daman/lotterycategory/lotterycategory_20240123160137lok5.png",
    url: "/"
  },
  {
    title: "Trx Win Go",
    img: "https://ossimg.envyenvelope.com/daman/lotterycategory/lotterycategory_202401231601472sqb.png",
    url: "/"
  },
];

export default function Home() {
  const router = useRouter();
  return (
    <main className="bg-white min-h-screen text-black px-6 py-10 space-y-12">
      {/* Platform Recommendation Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Platform Recommendation
          </h2>
          <button className="text-sm text-[#f95959] border border-[#f95959] hover:bg-[#f95959] hover:text-white p-2 rounded">
            All ({games.length}) →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {games.map((game, i) => (
            <div key={i} className="space-y-2">
              {/* Card with background image */}
              <div
                className="h-40 rounded-lg overflow-hidden bg-contain bg-no-repeat bg-center"
                style={{ backgroundImage: `url(${game.img})` }}
              ></div>

              {/* Odds Info Below */}
              <div className="text-sm text-center">
                <span className="text-black font-medium">Odds of winning:</span>{" "}
                <span className="text-green-400 font-bold">{game.odds}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lottery Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Lottery</h2>
          <button className="text-sm text-[#f95959] border border-[#f95959] hover:bg-[#f95959] hover:text-white p-2 rounded">
            All ({lotteryGames.length}) →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {lotteryGames.map((lotto, i) => (
            <div
              key={i}
              onClick={() => router.push(lotto.url)}
              className="secondary-color cursor-pointer rounded-xl overflow-hidden hover:bg-zinc-700 transition shadow-md"
            >
              {/* Title at the top */}
              <div className="p-3 text-center">
                <h3 className="text-base font-semibold text-white">
                  {lotto.title}
                </h3>
              </div>

              {/* Large centered icon */}
              <div className="flex justify-center items-center h-48">
                <img
                  src={lotto.img}
                  alt={lotto.title}
                  className="h-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
