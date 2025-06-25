import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/public/WORKOUT TRACKER.png'
import { AuthModal } from './AuthModal';

export function Navbar() {
    return(
        <div className="flex py-4 items-center justify-between">
            <Link href="/" className='flex items-center gap-2'>
                <Image src={Logo} alt='Logo' className='size-20 '>
                </Image>
                <h4 className='text-3xl font-semibold'>
                Workout <span className='text-blue-500'>Tracker</span>
                </h4>
            </Link>

            <AuthModal />
        </div>
    )
}