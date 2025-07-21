import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlockProps {
	className?: string;
	[key: string]: any;
}

const Block = ({ className, ...rest }: BlockProps) => {
	return (
		<motion.div
			initial="initial"
			animate="animate"
			variants={{
				initial: {
					scale: 0.9,
					y: 20,
					opacity: 0,
				},
				animate: {
					scale: 1,
					y: 0,
					opacity: 1,
				},
			}}
			transition={{
				type: "spring",
				mass: 2,
				stiffness: 200,
				damping: 30,
			}}
			className={cn(
				"col-span-4 rounded-2xl border bg-white p-8 shadow-md",
				className,
			)}
			{...rest}
		/>
	);
};

export { Block };