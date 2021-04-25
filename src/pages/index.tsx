// @collapse

import styles from '../styles/pages/home.module.scss';

import React, { Fragment } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import api, { IApiParams } from '../services/api';

import { IEpisode, IEpisodeApi } from '../utils/interfaces/Episode';
import CreateEpisodeFromApi from '../utils/functions/CreateEpisodeFromApi';
import CreateTrueArray from '../utils/functions/CreateTrueArray';


import EpisodeThumb from '../components/EpisodeThumb';
import ButtonWithImage from '../components/ButtonWithImage';
import usePlayer from '../contexts/PlayerContext';

interface IHomeEpisode extends Omit<IEpisode, 'description' >{}

interface IHomeProps {
   latestEpisodes: IHomeEpisode[];
   previousEpisodes: IHomeEpisode[];
}

interface IEpisodeDetailProps extends Omit<IHomeEpisode, 'thumbnail'>{
   tags: string[];
   tagProps?: object[];
}

export default function Home({ latestEpisodes, previousEpisodes }: IHomeProps) {
   const allEpisodes = [].concat(latestEpisodes).concat(previousEpisodes);

   return (
      <div className={ styles.container }>
         <Head>
            <title>Home | Podcastr</title>
         </Head>

         <section className={ styles.latestEpisodes }>
            <h2>Últimos Lançamentos</h2>

            <ul>{ latestEpisodes.map( ( episode, index ) => EpisodeLabel(episode, index, allEpisodes) ) }</ul>
         </section>

         <section className={ styles.allEpisodes }>
            <h2>Todos os Episódios</h2>

            <table cellSpacing={ 0 }>
               <thead>
                  <tr>
                     <th></th>
                     <th>Podcast</th>
                     <th>Integrantes</th>
                     <th>Data</th>
                     <th>Duração</th>
                     <th></th>
                  </tr>
               </thead>
               <tbody>{ previousEpisodes.map( ( episode, index ) => EpisodeCell(episode, index + latestEpisodes.length , allEpisodes) ) }</tbody>
            </table>
         </section>
      </div>
   );
}

export const getStaticProps: GetStaticProps = async ( ctx ) => {
   const { data } : { data: IEpisodeApi[] } = await api.get( '/episodes', {
      params: {
         _limit: 12
         , _sort: "published_at"
         , _order: "desc"
      } as IApiParams
   } );

   const episodes = data.map( CreateEpisodeFromApi );

   const latestEpisodes = episodes.slice(0, 2);
   const previousEpisodes = episodes.slice(2);

   return ({
      props: { latestEpisodes, previousEpisodes }
      , revalidate: 60 * 60 * 8 // 8 hrs
   });
}

// *** Sub Components

   // #region *** Episode Body

function EpisodeLabel( episode: IHomeEpisode, index: number, episodes: IHomeEpisode[] ) {
   const {
      id
      , thumbnail
      , title
   } = episode;

   const tags = ['', 'p', 'span', 'span'];
   const tagProps = CreateTrueArray(4, {});

   const props = Object.assign( episode, { tags, tagProps } ) as IEpisodeDetailProps;

   // ***

   return (
      <li key={ id }>
         <EpisodeThumb {...{thumbnail, title, size: 192}} />

         <div className={ styles.episodeDetails }>
            <EpisodeDetail { ...props } />
         </div>

         { EpisodeButtonPlay(index, episodes) }
      </li>
   );
}

function EpisodeCell( episode: IHomeEpisode, index: number, episodes: IHomeEpisode[] ) {
   const {
      id
      , thumbnail
      , title
   } = episode;

   const tags = CreateTrueArray(4, 'td');
   const tagProps = CreateTrueArray(4, withClassName(''));
      tagProps[2] = withClassName(styles.cellDate);

   const props = Object.assign( episode, { tags, tagProps } ) as IEpisodeDetailProps;

   function withClassName( className: string ) {
      return ( {className} );
   }

   // ***

   return (
      <tr key={ id }>
         <td className={ styles.cellImage }><EpisodeThumb {...{thumbnail, title, size: 120}} /></td>

         <EpisodeDetail { ...props } />

         <td>{ EpisodeButtonPlay(index, episodes) }</td>
      </tr>
   );
}

   // #endregion *** Episode Body

   // #region *** Episode Miscellaneous

function EpisodeDetail( { tags, tagProps, ...rest}: IEpisodeDetailProps ) {
   const {
      id
      , title
      , members
      , publishedAt: date
      , publishedAtAsTime: dateTime
      , durationAsString
   } = rest;

   const ChildLink = ( <Link href={ `/episodes/${id}` }><a>{ title }</a></Link> );
   const ChildMembers = ( <Fragment>{ members }</Fragment> );
   const ChildTime = ( <time { ...{dateTime} }>{ date }</time> );
   const ChildDuration = ( <Fragment>{ durationAsString }</Fragment> );

   function CreateCustomTag( index ) {
      const children = ( [ChildLink, ChildMembers, ChildTime, ChildDuration] );
      const props = ( {
         children: children[index]
         , ...tagProps[index]
      } );

      return ( React.createElement( tags[index] || Fragment, props ) );
   }

   // ***

   return (
      <Fragment>
         { CreateCustomTag(0) }
         { CreateCustomTag(1) }
         { CreateCustomTag(2) }
         { CreateCustomTag(3) }
      </Fragment>
   );
}

function EpisodeButtonPlay( index: number, episodes: IHomeEpisode[] ) {
   const { PlayAList } = usePlayer();

   const fixedEpisodes = episodes.map( episode => {
      const {
         title
         , thumbnail
         , members
         , duration
         , url
      } = episode;

      return ({
         title
         , thumbnail
         , members
         , duration
         , url
      });
   } )

   const play = () => PlayAList( fixedEpisodes , index );

   return (
      <ButtonWithImage
         icon="play-green"
         alt="Tocar Episódio"
         onClick={ play }
      />
   );
}

   // #endregion *** Episode Miscellaneous