
export const log = (...args) => {
  if (import.meta.env.MODE === "dev") {
    console.log(...args);
  }
};
