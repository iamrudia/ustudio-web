export default function WriteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // In a real application, you would check for authentication here
    // import { createClient } from '@/lib/supabase/server';
    // const supabase = createClient();
    // const { data: { session } } = await supabase.auth.getSession();
    // if (!session) redirect('/login');

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950">
            {/* Optional: Add a specific header for the editor or auth check */}
            {children}
        </div>
    );
}
