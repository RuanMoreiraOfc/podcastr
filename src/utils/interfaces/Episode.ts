export interface IFileApi {
    url: string;
    type: string;
    duration: number;
}

export interface IEpisodeApi {
    id: string;
    title: string;
    members: string;
    published_at: string;
    thumbnail: string;
    description: string;

    file: IFileApi;
}

export interface IFile extends Omit<IFileApi, 'type'> {
    durationAsString: string;
}

export interface IEpisode extends Omit<IEpisodeApi, 'file' | 'published_at'> {
    publishedAt: string;
    publishedAtAsTime: string;

    file: IFile;
}