export const output = (message: string, exit: number|null = null) => {
  console.log(message);
  if (exit !== null)
    process.exit(exit);
}