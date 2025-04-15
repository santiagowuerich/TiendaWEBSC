import clsx from 'clsx';

export default function LogoIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`${process.env.SITE_NAME} logo`}
      viewBox="0 0 500 500"
      {...props}
      className={clsx('fill-white', props.className)}
    >
      {/* SVG de tres diamantes concéntricos */}
      <path d="M250 62L62 250L250 438L438 250L250 62ZM250 125L375 250L250 375L125 250L250 125Z" />
      <path d="M250 188L313 250L250 313L188 250L250 188Z" />
      <path d="M250 0L0 250L250 500L500 250L250 0ZM250 62L438 250L250 438L62 250L250 62Z" />
    </svg>
  );
}
