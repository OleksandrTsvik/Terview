export const NOTE_RULES = {
  slug: { min: 1, max: 512 },
  title: { min: 2, max: 1024 },
};

export const USER_RULES = {
  email: { max: 128 },
  password: { min: 6, max: 32 },
};
