import logo from '@/assets/svgs/cccoil.svg';
import { cn } from '@/utils';

const Spinner = () => {
    return (
        <div className={cn('flex items-center')}>
            <img src={logo} alt="logo" className={cn('w-14 h-16 animate-spinner-linear-spin duration-700 repeat-infinite')} />
        </div>
    );
};

export default Spinner;