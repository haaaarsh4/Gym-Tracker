"use client";

import { cn } from "@/lib/utils";
import { Calendar1, CirclePlus, HomeIcon, LucideProps, Images, Bot, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface iAppProps {
    id : number;
    name : string;
    href : string;
    icon : ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}

export const dashboardLinks: iAppProps[] = [
    {
        id: 0,
        name: 'Profile',
        href: '/dashboard',
        icon: HomeIcon
    },
    {
        id: 1,
        name: 'Workout Calendar',
        href: '/dashboard/calendar',
        icon: Calendar1
    },
    {
        id: 2,
        name: 'Add Todays Workout',
        href: '/dashboard/addWorkout',
        icon: CirclePlus
    },
    {
        id: 3,
        name: 'Workout Gallery',
        href: '/dashboard/gallary',
        icon: Images
    },
    {
        id: 5,
        name: 'AI Assistant',
        href: '/dashboard/AIChat',
        icon: Bot
    },
    {
        id: 4,
        name: 'Settings',
        href: '/dashboard/settings',
        icon: Settings
    },
]

export function DashboardLinks() {
    const pathname = usePathname();
    return (
        <>
        {dashboardLinks.map((link) => (
            <Link className={cn(
                pathname === link.href ? 'text-primary bg-primary/10' : "text-muted-foreground hover:text-foreground",
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
            )} key={link.id} href={link.href}>
                <link.icon className="size-4" />
                {link.name}
            </Link>
        ))}
        </>
    )
}