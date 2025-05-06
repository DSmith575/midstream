import logo from '@/assets/svgs/cccoil.svg';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  className?: string;
  children?: React.ReactNode;
}

const Spinner = ({ className, children }: SpinnerProps) => {
	return (
		<div className={cn("flex flex-col items-center justify-center")}>
			<img
				src={logo}
				alt="spinner"
				className={cn("animate h-16 w-16 animate-spin", className)}
			/>
			{children}
		</div>
	);
};

export default Spinner;