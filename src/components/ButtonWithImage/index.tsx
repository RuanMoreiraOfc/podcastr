import React from "react";

interface IButtonWithImage extends Partial<HTMLButtonElement & HTMLImageElement> {
   icon: string;
}

export default function ButtonWithImage( {icon, ...rest}: IButtonWithImage ) {
   const buttonProps = rest as Partial<HTMLButtonElement>;
   const imgProps = rest as Partial<HTMLImageElement>;

   return (
      <button type="button" { ...{buttonProps} }>
         <img src={ `/icons/${icon}.svg` || rest.src } { ...{imgProps} }/>
      </button>
   );
}