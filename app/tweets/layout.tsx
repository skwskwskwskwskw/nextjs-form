import SideNavigation from "@/components/SideNavigation";

export default function NavLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex h-screen">
            <div className="w-1/4 p-4">
                <SideNavigation />
            </div>
            <div className="w-3/4 flex flex-col p-4">{children}</div>
        </main>
    );
}
