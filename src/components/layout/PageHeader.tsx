interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">{title}</h1>
      {subtitle && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
}
