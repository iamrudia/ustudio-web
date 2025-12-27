export default function EditLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Authentication check would go here similar to write layout
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950">
            {children}
        </div>
    );
}
