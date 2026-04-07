interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'bordered' | 'ghost';
}

const variants = {
  default:
    'bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-zinc-700/40 shadow-sm',
  elevated:
    'bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-zinc-700/40 shadow-md hover:shadow-lg transition-all duration-200',
  bordered:
    'bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-2xl border-2 border-zinc-200/50 dark:border-zinc-700/50',
  ghost:
    'bg-zinc-50/50 dark:bg-zinc-900/30 backdrop-blur-sm rounded-2xl',
};

export default function Card({ children, className = '', variant = 'default' }: CardProps) {
  return (
    <div className={`p-5 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
