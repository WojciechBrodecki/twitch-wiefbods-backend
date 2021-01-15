"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const mongoose_1 = __importDefault(require("mongoose"));
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const user_agents_1 = __importDefault(require("user-agents"));
const const_1 = require("./core/const");
puppeteer_extra_1.default.use(puppeteer_extra_plugin_stealth_1.default());
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Starting server process.');
        mongoose_1.default.connect('mongodb://localhost:27017/wiefbodsBackend', { useNewUrlParser: true, useUnifiedTopology: true });
        createNewWatcherInstance();
    }
    catch (error) {
        console.log(chalk_1.default.red('Failed to start server process: ' + error.message));
        console.log(error.stack);
        process.exit(-1);
    }
});
function createNewWatcherInstance() {
    return __awaiter(this, void 0, void 0, function* () {
        let browser;
        //TODO: here will be getting free 
        browser = yield puppeteer_extra_1.default.launch({ headless: process.env.NODE_ENV === 'prod' });
        const context = yield browser.createIncognitoBrowserContext();
        try {
            console.log('Logging to account: name');
            yield loginToTwitch(context, 'mrwojtusxsztos', 'wojoto2000');
            console.log(chalk_1.default.green(`Successful login to account mrwojtusxsztos`)); //FIXME: after setting up getting user data from mongoose
        }
        catch (error) {
            console.log(chalk_1.default.red(`Unexpected error: recommend to check dev version`)); //FIXME: after setting up getting user data from mongoose
            yield browser.close();
        }
    });
}
function loginToTwitch(incognitoContext, login, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = yield incognitoContext.newPage();
        yield page.setViewport({
            width: 1440 + Math.floor(Math.random() * 100),
            height: 1920 + Math.floor(Math.random() * 100),
            deviceScaleFactor: 1,
            hasTouch: false,
            isLandscape: false,
            isMobile: false,
        });
        yield page.setUserAgent(user_agents_1.default.toString());
        yield page.goto(const_1.URLS.TWITCH_LOGIN_PAGE);
        yield page.waitForSelector(const_1.PAGE_SELECTORS.LOGIN_INPUT);
        yield page.type(const_1.PAGE_SELECTORS.LOGIN_INPUT, 'mrwojtusxsztos');
        yield page.type(const_1.PAGE_SELECTORS.PASSWORD_INPUT, 'Wojoto2000!');
        yield page.keyboard.down("Enter");
    });
}
init();
//# sourceMappingURL=app.js.map