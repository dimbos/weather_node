#!/usr/bin/env node
import {getArgs} from './helpers/args.js';
import { getWeather, getIcon } from './services/api.service.js';
import { printHelp, printSuccess, printError, printWeather } from './services/log.service.js';
import { saveKeyValue, TOKEN_DICTIONARY, getKeyValue } from './services/storage.servise.js';

const saveToken = async (token) => {
    if(!token.length){
        printError('Не передан токен');
        return;
    }
    try {
        await  saveKeyValue(TOKEN_DICTIONARY.token, token);
        printSuccess('Токен сохранён');
    } catch(e){
        printError(e.message);
    }
}

const saveCity = async (city) => {
    if(!city.length){
        printError('Не передан город');
        return;
    }
    try {
        await  saveKeyValue(TOKEN_DICTIONARY.city, city);
        printSuccess('Город сохранён');
    } catch(e){
        printError(e.message);
    }
}


const getForecast = async () => {
    try {
        const city = process.env.CITY ?? await getKeyValue(TOKEN_DICTIONARY.city);
        const weather = await getWeather(city);
        // console.log(weather);
        printWeather(weather, getIcon(weather.weather[0].icon));
    } catch(e){
        if(e?.response?.status === 404){
            printError('Неверно указан город');
        } else if (e?.response?.status === 401){
            printError('Неверно указан токен');
        }else {
            printError(e.message);
        }
    }
}

const initCLI = () => {
    // console.log('started');
    const args = getArgs(process.argv);
    // console.log(args); //вывод переданных команд
    
    if(args.h) {
        return printHelp();
        //вывод помощи
    }
    if(args.c){
        //сохранить город
        return saveCity(args.c);
       
    }
    if(args.t){
        //сохранить токен
        return saveToken(args.t);
    }
    
    //вывести погоду
    return getForecast();
};

initCLI();