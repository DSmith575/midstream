import logo from "@/assets/svgs/cccoil.svg";
import { cn } from "@/lib/utils";

interface SpinnerProps {
	className?: string;
}

const Spinner = ({ className }: SpinnerProps) => {
	return (
		<div className={cn("flex items-center")}>
			<img
				src={logo}
				alt="logo"
				className={cn("animate h-16 w-16 animate-spin", className)}
			/>
		</div>
	);
};

export default Spinner;
