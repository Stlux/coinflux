import {createTheme} from 'react-data-table-component'

export default function floorToTwoDecimals(num:number):number{
    return Math.floor(num*100)/100;
}

function darkTheme():void{
    createTheme('solarized', {
        text: {
            primary: '#eee',
            secondary: '#fff',
        },
        background: {
            default: '#1e1e1e',
        },
        context: {
            background: '#1e1e1e',
            text: '#FFF',
        },
        divider: {
            default: '#3e3e3e',
        }
    }, 'dark');
}

export{
    darkTheme
}
