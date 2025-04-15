import React from 'react';

export function LogoWithText() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-none items-center justify-center h-10 w-10 rounded-lg bg-black overflow-hidden">
        <img
          src="/images/PERFIL NEGRO.png"
          alt="SC Equipamientos Logo"
          className="h-full w-full object-contain"
        />
      </div>
      <span className="text-white text-lg font-semibold leading-none">SC EQUIPAMIENTOS</span>
    </div>
  );
} 