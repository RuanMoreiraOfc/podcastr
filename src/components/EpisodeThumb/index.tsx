import Image from "next/image";

import { IEpisode } from "../../utils/interfaces/Episode";

export default function EpisodeThumb( { size, thumbnail: src, title: alt } : { size: number | number[] } & Pick<IEpisode, 'thumbnail' | 'title' > ) {
   const sizeIsArray = size instanceof Array;

   const sizes = {
      width: Number(sizeIsArray ? size[0] : size)
      , height: Number(sizeIsArray ? size[1] : size)
   }

   return (
      <Image
         { ...sizes }
         objectFit={ 'cover' }
         { ...{src, alt} }
      />
   )
}