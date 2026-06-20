// Tailwind animation classes para uso em componentes
export const animations = {
  // Transições básicas
  fadeIn: 'animate-fadeIn',
  slideUp: 'animate-slideUp',
  slideDown: 'animate-slideDown',

  // Efeitos de hover
  hover: {
    lift: 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300',
    brighten: 'hover:bg-opacity-90 transition-opacity duration-300',
    scale: 'hover:scale-105 transition-transform duration-300',
    glow: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-shadow duration-300'
  },

  // Efeitos de foco
  focus: {
    ring: 'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-200'
  },

  // Transições de página
  pageTransition: 'animate-fadeIn',

  // Cards
  cardHover: 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out',
  cardInteractive: 'cursor-pointer hover:bg-slate-50 transition-colors duration-200',

  // Botões
  buttonHover: 'hover:shadow-lg active:scale-95 transition-all duration-200',
  buttonLoading: 'animate-pulse',

  // Spinners
  spinner: 'animate-spin',

  // Pulso
  pulse: 'animate-pulse'
};

// Estilos CSS customizados a adicionar ao tailwind.config.ts
export const customAnimationStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
