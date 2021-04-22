import styles from '../../styles/pages/episodes.module.scss';

import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { parseISO } from 'date-fns';

import api from '../../services/api';

import ConvertToPtBrDate from '../../utils/functions/ConvertToPtBrDate';
import ConvertDurationToTimeString from '../../utils/functions/ConvertDurationToTimeString';
import { IEpisode, IEpisodeApi } from '../../utils/interfaces/Episode';

import EpisodeThumb from '../../components/EpisodeThumb';
import ButtonWithImage from '../../components/ButtonWithImage';

interface IEpisodeProps {
   episode: IEpisode;
}

export default function Episode( { episode }: IEpisodeProps ) {
   const {
      thumbnail
      , title
      , description
      , members
      , publishedAt: date
      , publishedAtAsTime: dateTime
      , file: source
   } = episode;

   return (
      <div className={ styles.wrapper }>
         <Head>
            <title>{title} | podcastr</title>
         </Head>

         <div className={ styles.container }>
            <Link href='/'>
               <a><ButtonWithImage icon={ 'arrow-left' } alt={ 'Voltar' } className={ styles.left } /></a>
            </Link>
            <EpisodeThumb size={[700, 160]} thumbnail={ thumbnail } title={ title } />
            <ButtonWithImage icon={ 'play' } alt={ 'Tocar Episódio' } className={ styles.right } />
         </div>

         <header>
            <h1>{ title }</h1>
            <span>{ members }</span>
            <span><time { ...{dateTime} }>{ date }</time></span>
            <span>{ source.durationAsString }</span>
         </header>

         <div className={ styles.description } dangerouslySetInnerHTML={ { __html: description } } />
      </div>
   )
}

export const getStaticPaths: GetStaticPaths = async ( ctx ) => {
   return ({
      paths: []
      , fallback: 'blocking'
   })
}

export const getStaticProps: GetStaticProps = async ( ctx ) => {
   const { slug } = ctx.params;
   const { data } = await api.get( `/episodes/${slug}`);

   const episode: IEpisode = [data].map( ( episodeData: IEpisodeApi ) => {
      const { published_at: date, ...rest } = episodeData;
      const duration = rest.file.duration;

      const base = Object.assign(rest) as IEpisode;

      base.publishedAt = ConvertToPtBrDate( parseISO( date ), 'd MMM yy' )
      base.publishedAtAsTime = date;
      base.file.duration = duration
      base.file.durationAsString = ConvertDurationToTimeString( duration )

      return base;
   } )[0]

   return ({
      props: { episode }
      , revalidate: 60 * 60 * 24 // 24 Hrs
   })
}