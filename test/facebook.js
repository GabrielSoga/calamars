import test from 'ava';
import request from 'request-promise';
import { FacebookMessengerBot } from 'lib/facebook';

test('Evironment var for the Facebook app is set', t => {
    t.truthy(process.env.FB_CALLBACK_PATH);
    t.truthy(process.env.FB_VERIFY_TOKEN);
    t.truthy(process.env.FB_PAGE_ACCESS_TOKEN);
    t.truthy(process.env.PORT);
});

test('Bot Class empty instantiation', t => {
    const bot = new FacebookMessengerBot();
    t.is(typeof bot.then, 'function');
});

const PORT = parseInt(process.env.PORT, 10);
const FB_CALLBACK_PATH = process.env.FB_CALLBACK_PATH;
const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

test('Bot with pages to subscribe', t => {
    const bot = new FacebookMessengerBot({
        port: PORT + 1,
        pageTokens: [FB_PAGE_ACCESS_TOKEN]
    });
    t.is(typeof bot.then, 'function');
});

test('Bot Webserver launches and returns expected challenge', async t => {
    const port = PORT + 2;
    const uri = `http://localhost:${port}${FB_CALLBACK_PATH}`;
    const botConfig = {
        port
    };
    const bot = new FacebookMessengerBot(botConfig);
    const serverStarted = await bot;
    t.true(serverStarted);
    const challenge = 'Foobar';
    const validationErrorString = 'Error, wrong validation token';
    const requestOptions = {
        uri,
        qs: {
            'hub.verify_token': FB_VERIFY_TOKEN,
            'hub.challenge': challenge
        }
    };
    const returnedBody = await request(requestOptions);
    t.is(returnedBody, challenge);
    const returnedBody2 = await request.get(uri);
    t.is(returnedBody2, validationErrorString);
});

test(
    'Bot responds with false when it receives a POST on the webhook with no entry parameter',
    async t => {
        const port = PORT + 3;
        const uri = `http://localhost:${port}${FB_CALLBACK_PATH}`;
        const bot = await new FacebookMessengerBot({ port });
        t.true(bot);
        const botResponse = await request({
            uri,
            method: 'POST',
            body: {},
            json: true
        });
        t.false(botResponse);
    }
);
test(
    'Bot with an onUpdate handler calls it when a POST is received',
    async t => {
        const port = PORT + 4;
        const uri = `http://localhost:${port}${FB_CALLBACK_PATH}`;
        const listeners = {
            onUpdate: update => {
                t.is(typeof update, 'object');
            }
        };
        const bot = new FacebookMessengerBot({ port, listeners });
        const serverStarted = await bot;
        t.true(serverStarted);
        const requestOptions = {
            uri,
            method: 'POST',
            body: { entry: [{ messaging: [{ }] }] },
            json: true
        };
        const returnedBody = await request(requestOptions);
        t.true(returnedBody);
        t.plan(3);
    }
);
test(
    'Bot with an onMessage handler calls it when a message POST is received',
    async t => {
        const port = PORT + 5;
        const uri = `http://localhost:${port}${FB_CALLBACK_PATH}`;
        const msg = 'Foobar';
        const listeners = {
            onMessage: ({ message }) => {
                t.is(message.text, msg);
            }
        };
        const bot = new FacebookMessengerBot({ port, listeners });
        const serverStarted = await bot;
        t.true(serverStarted);
        const requestOptions = {
            uri,
            method: 'POST',
            body: { entry: [{ messaging: [{ message: { text: msg } }] }] },
            json: true
        };
        const returnedBody = await request(requestOptions);
        t.true(returnedBody);
        t.plan(3);
    }
);
test(
    'Bot with onAuthentication, onDelivery and onPostback listeners',
    async t => {
        const port = PORT + 6;
        const uri = `http://localhost:${port}${FB_CALLBACK_PATH}`;
        const ref = 'PASS_THROUGH_PARAM';
        const watermark = 1458668856253;
        const payload = 'USER_DEFINED_PAYLOAD';
        const listeners = {
            onAuthentication: ({ optin }) => {
                t.is(optin.ref, ref);
            },
            onDelivery: ({ delivery }) => {
                t.is(delivery.watermark, watermark);
            },
            onPostback: ({ postback }) => {
                t.is(postback.payload, payload);
            }
        };
        const bot = new FacebookMessengerBot({ port, listeners });
        const serverStarted = await bot;
        t.true(serverStarted);
        const requestOptions = {
            uri,
            method: 'POST',
            body: { entry: [
                { messaging: [
                    { optin: { ref } },
                    { delivery: { watermark } }
                ] },
                { messaging: [
                    { postback: { payload } }
                ] }
            ] },
            json: true
        };
        const returnedBody = await request(requestOptions);
        t.true(returnedBody);
        t.plan(5);
    }
);