export const Color = {
  Base: {
    Surface: {
      1: '#000000',
      2: '#111111',
      3: '#222222',
    },
    Content: {
      1: '#FFFFFF',
      2: '#CCCCCC',
      3: '#999999',
    }
  },
  Accent: {
    Surface: {
      1: '#3B82F6',
    },
    Content: {
      1: '#FFFFFF',
    }
  },
  Error: {
    Surface: {
      1: '#EF4444',
    },
    Content: {
      1: '#FFFFFF',
    }
  },
  Success: {
    Surface: {
      1: '#10B981',
    },
    Content: {
      1: '#FFFFFF',
    }
  }
};

export const Space = {
  XS: 4,
  S: 8,
  M: 16,
  L: 24,
  XL: 32,
  XXL: 48,
};

export const Radius = {
  S: 4,
  M: 8,
  L: 16,
  XL: 24,
  Full: 9999,
};

export const Type = {
  Expressive: {
    Display: {
      L: { fontSize: '48px', lineHeight: '1.1', fontWeight: '700', fontFamily: 'Bebas Neue, sans-serif' },
      M: { fontSize: '32px', lineHeight: '1.2', fontWeight: '700', fontFamily: 'Bebas Neue, sans-serif' },
    },
    Headline: {
      L: { fontSize: '24px', lineHeight: '1.3', fontWeight: '600', fontFamily: 'Bebas Neue, sans-serif' },
    }
  },
  Readable: {
    Body: {
      L: { fontSize: '16px', lineHeight: '1.5', fontWeight: '400', fontFamily: 'Inter, sans-serif' },
      M: { fontSize: '14px', lineHeight: '1.5', fontWeight: '400', fontFamily: 'Inter, sans-serif' },
    },
    Label: {
      M: { fontSize: '14px', lineHeight: '1.4', fontWeight: '600', fontFamily: 'Inter, sans-serif' },
      S: { fontSize: '12px', lineHeight: '1.4', fontWeight: '500', fontFamily: 'Inter, sans-serif' },
    }
  }
};
