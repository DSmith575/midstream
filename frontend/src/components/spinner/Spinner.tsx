import logo from '@/assets/svgs/cccoil.svg';
import { cn } from '@/utils';

interface SpinnerProps {
    className?: string;
}

const Spinner = ({className}: SpinnerProps) => {
    return (
        <div className={cn('flex items-center')}>
            <img src={logo} alt="logo" className={cn('w-16 h-16 animate animate-spin', className)} />
        </div>
    );
};

export default Spinner;