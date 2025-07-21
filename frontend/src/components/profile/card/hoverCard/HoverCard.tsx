
interface HoverCardProps {
  title: string;
  subtitle: string;
  Icon: React.ElementType;
  onClick: () => void;
}

const HoverCard = ({ title, subtitle, Icon, onClick }: HoverCardProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded border border-slate-300 relative overflow-hidden group bg-white"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-[#59b5e1] translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />
      <Icon className="absolute z-10 -top-12 -right-12 text-9xl text-slate-100 group-hover:text-violet-400 group-hover:rotate-12 transition-transform duration-300" />
      <Icon className="mb-2 text-2xl text-violet-600 group-hover:text-white transition-colors relative z-10 duration-300" />
      <h3 className="font-medium text-lg text-slate-950 group-hover:text-white relative z-10 duration-300">
        {title}
      </h3>
      <p className="text-slate-400 group-hover:text-violet-200 relative z-10 duration-300">
        {subtitle}
      </p>
    </button>
  );
};

export { HoverCard };