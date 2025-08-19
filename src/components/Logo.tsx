import * as React from "react";

function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 50"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Prime Cuts Online Logo"
      {...props}
    >
      <defs>
        <style>
          {
            "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap');"
          }
        </style>
      </defs>

      <text
        x="10"
        y="35"
        fontFamily="'Inter', sans-serif"
        fontSize="24"
        fill="hsl(var(--primary))"
        fontWeight="700"
      >
        Prime Cuts
      </text>

      <text
        x="130"
        y="35"
        fontFamily="'Inter', sans-serif"
        fontSize="24"
        fill="hsl(var(--foreground))"
        fontWeight="700"
      >
        Online
      </text>
    </svg>
  );
}

export default Logo;
