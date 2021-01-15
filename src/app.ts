import chalk from 'chalk';
import mongoose from 'mongoose';
import { Browser, BrowserContext, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import userAgent from 'user-agents';

import { PAGE_SELECTORS, URLS } from './core/const';

puppeteer.use(StealthPlugin());

const init = async (): Promise<void> => {
  try {
    console.log('Starting server process.');

    mongoose.connect('mongodb://localhost:27017/wiefbodsBackend', { useNewUrlParser: true, useUnifiedTopology: true });
    createNewWatcherInstance();
  } catch (error) {
    console.log(chalk.red('Failed to start server process: ' + error.message));
    console.log(error.stack);
    process.exit(-1);
  }
};

async function createNewWatcherInstance() {
  let browser: Browser;
  //TODO: here will be getting free 
  browser = await puppeteer.launch({ headless: process.env.NODE_ENV === 'prod' });
  const context = await browser.createIncognitoBrowserContext();
  try {
    console.log('Logging to account: name')
    await loginToTwitch(context, 'mrwojtusxsztos', 'wojoto2000');
    console.log(chalk.green(`Successful login to account mrwojtusxsztos`)); //FIXME: after setting up getting user data from mongoose
  } catch (error) {
    console.log(chalk.red(`Unexpected error: recommend to check dev version`)); //FIXME: after setting up getting user data from mongoose
    await browser.close();
  }
}

async function loginToTwitch(incognitoContext: BrowserContext, login: string, password: string) {

  const page = await incognitoContext.newPage();
  await page.setViewport({
    width: 1440 + Math.floor(Math.random() * 100),
    height: 1920 + Math.floor(Math.random() * 100),
    deviceScaleFactor: 1,
    hasTouch: false,
    isLandscape: false,
    isMobile: false,
  });
  await page.setUserAgent(userAgent.toString())

  await page.goto(URLS.TWITCH_LOGIN_PAGE);
  await page.waitForSelector(PAGE_SELECTORS.LOGIN_INPUT);
  await page.type(PAGE_SELECTORS.LOGIN_INPUT, 'mrwojtusxsztos');
  await page.type(PAGE_SELECTORS.PASSWORD_INPUT, 'Wojoto2000!');
  await page.keyboard.down("Enter");
}

init();
