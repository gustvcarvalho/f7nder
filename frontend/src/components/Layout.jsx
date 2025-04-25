
import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 to-purple-300 overflow-x-hidden">
      <main className="flex-grow">{children}</main>
      <footer className="bg-purple-950 text-white py-2 text-center mt-auto">
        © 2025 F7nder. Todos os direitos reservados.
      </footer>
    </div>
  );
}
