export function AsciiName() {
  const ascii = `
__   ___   _ ____  ___   _____ ___  _     _____ ____   ___
\\ \\ / / | | |  _ \\|_ _| |_   _/ _ \\| |   | ____|  _ \\ / _ \\
 \\ V /| | | | |_) || |    | || | | | |   |  _| | | | | | | |
  | | | |_| |  _ < | |    | || |_| | |___| |___| |_| | |_| |
  |_|  \\___/|_| \\_\\___|   |_| \\___/|_____|_____|____/ \\___/
`.trimStart();

  return (
    <pre className="text-[#33ff33] text-xs sm:text-sm leading-none select-none">
      {ascii}
    </pre>
  );
}
