import { JourneyCard } from "./JourneyCard";
import { journeyCardsData } from "./JourneyCardsData";

export default function JourneyCards() {
  return (
    <section className="px-6 py-10 max-w-5xl mx-auto mt-8">
      <p className="text-gray-500 text-sm mb-1">Your SkillShikshya Journey</p>
      <h2 className="text-3xl font-bold mb-10">
        <span className="text-[#2E9E6B]">Step</span>{" "}
        <span className="text-gray-800">In.</span>{" "}
        <span className="text-[#D94F3D]">Skill</span>{" "}
        <span className="text-gray-800">Up.</span>{" "}
        <span className="text-gray-800">Stand Out.</span>{" "}
        <span>🚀</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {journeyCardsData.map((card, index) => (
       
          <div key={card.id} className=" rounded-3xl">
            <JourneyCard
              card={card}
              hasAnimation={index < 2}
            />
          </div>
        ))}
      </div>
    </section>
  );
}