import { MouseEventHandler } from "react";

interface IButtonWithImage {
   alt: string;
   icon: string;
   disabled?: boolean;
   className?: string;
   onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function ButtonWithImage( {icon, alt, ...rest}: IButtonWithImage ) {
   return (
      <button type="button" { ...rest }>
         <img src={ `/icons/${icon}.svg` } alt={alt}/>
      </button>
   );
}