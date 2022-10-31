import { re11 } from '../rice/re11';
import { re12 } from '../rice/re12';
import { re15 } from '../rice/re15';

import { FastifyReply } from 'fastify';

const line = require('@line/bot-sdk');

export const Line = async (request: any, reply: FastifyReply) => {
  const ping = new Date().getTime();
  const requestText = request.body.events[0].message.text;
  let returnHtml = '';

  if (requestText == '/도움' || requestText == '/help') {
    returnHtml += '/밥, /밥줘, /학, /학식: 학식 불러오기';
  }

  if (requestText == '/핑' || requestText == '/ping' || requestText == '/vld') {
    const pong = new Date().getTime();

    returnHtml += `퐁! ${pong - ping}`;
  }

  if (
    requestText == '/밥' ||
    requestText == '/qkq' ||
    requestText == '/밥줘' ||
    requestText == '/qkqwnj' ||
    requestText == '/학' ||
    requestText == '/gkr' ||
    requestText == '/학식' ||
    requestText == '/gkrtlr'
  ) {
    returnHtml += await re11();
    returnHtml += await re12();
    returnHtml += await re15();
  }

  if (returnHtml) {
    const client = new line.Client({
      channelAccessToken: process.env.LINE_API,
    });

    const message = {
      type: 'text',
      text: returnHtml,
    };

    client
      .replyMessage(request.body.events[0].replyToken, message)
      .then(() => {})
      .catch((err: any) => {
        // error handling
        console.log(err);
      });
  }
};
