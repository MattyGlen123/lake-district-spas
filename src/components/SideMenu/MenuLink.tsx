import Link from 'next/link';

interface MenuLinkProps {
  href: string;
  isActive: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MenuLink({ href, isActive, onClose, children }: MenuLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center px-4 py-3 rounded-2xl border border-transparent bg-white"
    >
      <span
        className={`font-serif ${
          isActive ? 'text-amber-700' : 'text-stone-800'
        }`}
      >
        {children}
      </span>
    </Link>
  );
}
