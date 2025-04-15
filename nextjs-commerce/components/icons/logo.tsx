import clsx from 'clsx';

export default function LogoIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SC Equipamientos logo"
      viewBox="0 0 500 500"
      {...props}
      className={clsx('fill-white', props.className)}
    >
      <path d="M 250 50.0 L 450.0 250 L 250 450.0 L 50.0 250 Z" />
      <path d="M 250 100.0 L 400.0 250 L 250 400.0 L 100.0 250 Z" />
      <path d="M 250 150.0 L 350.0 250 L 250 350.0 L 150.0 250 Z" />
    </svg>
  );
}

export function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
      <LogoIcon className="w-[22px] h-[22px]" />
      <span style={{ fontWeight: 600, fontSize: '1rem', marginLeft: '0.5rem' }}>
        SC Equipamientos
      </span>
    </div>
  );
}