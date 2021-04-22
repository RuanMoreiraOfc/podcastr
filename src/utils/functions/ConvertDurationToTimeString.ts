export default ( duration: number ): string => {
    const hours = Math.floor(duration / 60 / 60);
    const minutes = Math.floor(duration / 60 % 60);
    const seconds = Math.floor(duration % 60);
    // const miliSeconds = ( duration % 60 % 1 ) * 1000;

    const times = [hours, minutes, seconds].map( time => String(time).padStart(2, '0') )

    return times.join(':')
}