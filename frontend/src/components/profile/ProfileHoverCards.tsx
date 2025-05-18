import type { JSX } from "react";
import { useState } from "react";
import HoverCard from "@/components/profile/card/hoverCard/HoverCard";
import { formatPascalCase, getIconForKey } from "@/lib/functions/functions";

interface HoverDevCardsProps {
  componentMap: Record<string, () => JSX.Element>;
}

const ProfileHoverCards = ({ componentMap }: HoverDevCardsProps) => {
  const [selectedCard, setSelectedCard] = useState<string | null>("Account");

  const SelectedComponent = selectedCard ? componentMap[selectedCard] : null;

  return (
    <>
      <div className="min-h-[150px] max-h-full flex flex-col rounded-2xl  py-4 md:col-span-full">
        <div className="grid gap-2 lg:gap-4 grid-cols-2 lg:grid-cols-4">
        {Object.keys(componentMap).map((key) => (
            <HoverCard
              key={key}
              title={formatPascalCase(key)}
              subtitle={`View ${formatPascalCase(key)}`}
              Icon={getIconForKey(key)}
              onClick={() => setSelectedCard((prev) => (prev === key ? null : key))}
            />
          ))}
        </div>
      </div>

      {SelectedComponent && (
        <div className="mt-2 col-start-1">{<SelectedComponent />}</div>
      )}
    </>
  );
};



export default ProfileHoverCards;
