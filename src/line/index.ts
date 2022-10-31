import { re11 } from '../rice/re11';
import { re12 } from '../rice/re12';
import { re15 } from '../rice/re15';

import { FastifyReply } from 'fastify';

const line = require('@line/bot-sdk');

export const Line = async (request: any, reply: FastifyReply) => {
  const requestText = request.body.events[0].message.text;
  let returnHtml = '';

  if (requestText == '/도움' || requestText == '/help') {
    returnHtml += '/밥, /밥줘, /학, /학식: 학식 불러오기';
  }

  if (requestText == '/랜덤' || requestText == '/random') {
    returnHtml += '/랜덤|random [항목1, 항목2]';
  }

  if (requestText.includes('/랜덤 ') || requestText.includes('/random ')) {
    console.log(requestText.includes('/랜덤'), requestText.includes('/random'));
    const rmprefix = requestText.includes('/랜덤')
      ? requestText.split('/랜덤 ')
      : requestText.includes('/random')
      ? requestText.split('/random ')
      : '';

    const a = rmprefix[1].split('[')[1].split(']')[0].split(',');
    console.log(a);

    returnHtml += a[Math.floor(Math.random() * a.length)].trim();
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
