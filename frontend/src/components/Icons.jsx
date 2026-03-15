function iconDefaults(size = 18) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': 'true',
    focusable: 'false',
  };
}

export function FilmIcon({ size = 20, className = '' }) {
  return (
    <svg {...iconDefaults(size)} className={className}>
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 4V20M16 4V20M3 9H21M3 15H21" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function SearchIcon({ size = 18, className = '' }) {
  return (
    <svg {...iconDefaults(size)} className={className}>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function HeartIcon({ size = 18, className = '', filled = false }) {
  return (
    <svg {...iconDefaults(size)} className={className}>
      <path
        d="M12 20.2C11.8 20.2 11.6 20.1 11.4 20C5.6 16.3 3 13.7 3 9.9C3 7.2 5.1 5 7.8 5C9.4 5 10.9 5.8 12 7.1C13.1 5.8 14.6 5 16.2 5C18.9 5 21 7.2 21 9.9C21 13.7 18.4 16.3 12.6 20C12.4 20.1 12.2 20.2 12 20.2Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function StarIcon({ size = 16, className = '' }) {
  return (
    <svg {...iconDefaults(size)} className={className}>
      <path
        d="M12 3.8L14.5 8.9L20.2 9.7L16.1 13.7L17.1 19.4L12 16.7L6.9 19.4L7.9 13.7L3.8 9.7L9.5 8.9L12 3.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CalendarIcon({ size = 16, className = '' }) {
  return (
    <svg {...iconDefaults(size)} className={className}>
      <rect x="4" y="5.5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3V7M16 3V7M4 10H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ClockIcon({ size = 16, className = '' }) {
  return (
    <svg {...iconDefaults(size)} className={className}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7.8V12L14.8 14.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function PlayIcon({ size = 16, className = '' }) {
  return (
    <svg {...iconDefaults(size)} className={className}>
      <path d="M8 6L18 12L8 18V6Z" fill="currentColor" />
    </svg>
  );
}

export function UserIcon({ size = 30, className = '' }) {
  return (
    <svg {...iconDefaults(size)} className={className}>
      <circle cx="12" cy="8.2" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 19.2C5.7 16.6 8 15 12 15C16 15 18.3 16.6 19 19.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ size = 15, className = '' }) {
  return (
    <svg {...iconDefaults(size)} className={className}>
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowLeftIcon({ size = 16, className = '' }) {
  return (
    <svg {...iconDefaults(size)} className={className}>
      <path d="M19 12H6M11 7L6 12L11 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 16, className = '' }) {
  return (
    <svg {...iconDefaults(size)} className={className}>
      <path d="M5 12H18M13 7L18 12L13 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WarningIcon({ size = 16, className = '' }) {
  return (
    <svg {...iconDefaults(size)} className={className}>
      <path d="M12 4L20 19H4L12 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 9V13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}
