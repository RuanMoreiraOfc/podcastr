import { format as formatDate } from 'date-fns';
import { ptBR as locale } from 'date-fns/locale';

export default ( date: Date, format: string ): string => {
    return formatDate( date , format, { locale } )
}