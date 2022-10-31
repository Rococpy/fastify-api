import { re11 } from '../rice/re11';
import { re12 } from '../rice/re12';
import { re15 } from '../rice/re15';

import { FastifyReply } from 'fastify';

const line = require('@line/bot-sdk');

function shuffle(array: any) {
  array.sort(() => Math.random() - 0.5);
}

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

    returnHtml += a[Math.floor(Math.random() * a.length)].trim();
  }

  if (requestText == '/사다리') {
    returnHtml +=
      '/사다리 [항목1, 항목2, ...] [인원1, 인원2, ...]\n 주의! 항목 수와 인원 수는 동일하게 작성해주세요!';
  }

  if (requestText.includes('/사다리 ')) {
    const rmprefix = requestText.split('/사다리');

    const a = rmprefix[1].split(' [')[1].split(']')[0].split(',');
    const b = rmprefix[1].split(' [')[2].split(']')[0].split(',');

    if (a.length != b.length)
      return (returnHtml = `항목과 인원의 수가 일치하지 않아요!`);

    shuffle(a);
    shuffle(b);

    returnHtml += `사다리 결과\n`;

    a.map((x: any, i: number) => {
      returnHtml += `\n${x.trim()} => ${b[i].trim()}`;
    });
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
