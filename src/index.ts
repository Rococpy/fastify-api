import { FastifyReply, FastifyRequest, fastify } from 'fastify';

import axios from 'axios';
import dotenv from 'dotenv';

import { cardType } from './card';

const line = require('@line/bot-sdk');

dotenv.config();

const PORT = Number(process.env.PORT || 4000);

const app = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'SYS:yyyy.mm.dd | TT hh:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  },
});

app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
  return 'Welcome to Rococpy Fastify API!';
});

app.get('/rice', async (request: FastifyRequest, reply: FastifyReply) => {
  reply.type('text/html; charset=utf-8');

  let returnHtml = '';

  await axios
    .get('https://www.hanyang.ac.kr/web/www/re11')
    .then(function (response) {
      // 성공 핸들링
      returnHtml +=
        response.data.split('<h3>')[1].split('</h3>')[0].trim() +
        `(\\${response.data.split(`class="price">`)[1].split('</p>')[0]})\n`;
      returnHtml +=
        ' - ' +
        response.data
          .split('<h3>')[2]
          .split('</h3>')[0]
          .split('[')[1]
          .split(']')[1]
          .trim()
          .split(', ')
          .join('\n - ');

      returnHtml += '\n\n';
    })

    .catch(function (error) {
      console.log(
        'Fail to get https://www.hanyang.ac.kr/web/www/re11 :' + error.code,
      );

      returnHtml +=
        error.code == undefined
          ? '오늘은 메뉴가 없는거 같아요! <a href="https://www.hanyang.ac.kr/web/www/re11" target="_blank">사이트</a>에서 확인해주세요!'
          : `오..이런.. 오류가 난거같아요 새로고침 해주세요!: ${error.code} `;
      returnHtml += '\n\n';
    });

  await axios
    .get('https://www.hanyang.ac.kr/web/www/re12')
    .then(function (response) {
      // 성공 핸들링
      returnHtml +=
        response.data.split('<h3>')[1].split('</h3>')[0].trim() +
        `(\\${
          response.data.split(`class="price">`)[1].split('</p>')[0]
        } | 택 1)\n`;

      returnHtml +=
        ' - ' +
        response.data
          .split('<h3>')[2]
          .split('</h3>')[0]
          .split('[')[1]
          .split(']')[1]
          .trim()
          .split(', ')
          .join('\n');

      returnHtml +=
        '\n - ' +
        response.data
          .split('<h3>')[3]
          .split('</h3>')[0]
          .split('[')[1]
          .split(']')[1]
          .trim()
          .split(', ')
          .join('\n - ');

      returnHtml += '\n\n';
    })
    .catch(function (error) {
      console.log(
        'Fail to get https://www.hanyang.ac.kr/web/www/re12 :' + error.code,
      );

      returnHtml +=
        error.code == undefined
          ? '오늘은 메뉴가 없는거 같아요! <a href="https://www.hanyang.ac.kr/web/www/re12" target="_blank">사이트</a>에서 확인해주세요!'
          : `오..이런.. 오류가 난거같아요 새로고침 해주세요!: ${error.code} `;

      returnHtml += '\n\n';
    });

  await axios
    .get('https://www.hanyang.ac.kr/web/www/re15')
    .then(function (response) {
      returnHtml +=
        response.data.split('<h3>')[1].split('</h3>')[0].trim() +
        `(\\${response.data.split(`class="price">`)[1].split('</p>')[0]})\n`;
      returnHtml +=
        ' - ' +
        response.data
          .split('<h3>')[2]
          .split('</h3>')[0]
          .split('[')[1]
          .split(']')[1]
          .trim()
          .split(', ')
          .join('\n - ');

      returnHtml += '\n\n';
    })
    .catch(function (error) {
      console.log(
        'Fail to get https://www.hanyang.ac.kr/web/www/re15 :' + error.code,
      );

      returnHtml +=
        error.code == undefined
          ? '오늘은 메뉴가 없는거 같아요! <a href="https://www.hanyang.ac.kr/web/www/re15" target="_blank">사이트</a>에서 확인해주세요!'
          : `오..이런.. 오류가 난거같아요 새로고침 해주세요!: ${error.code} `;
      returnHtml += '\n\n';
    });

  return `<div>${String(returnHtml).split('\n').join('<br>')}</div>`;
});

app.get('/cardtype', async (request: FastifyRequest, reply: FastifyReply) => {
  return cardType;
});

app.post('/cardtype/check', async (request: any, reply: FastifyReply) => {
  let returnData;
  cardType.map((x, i) => {
    const card6no = String(request?.body?.cardNo).replace('-', '').slice(0, 6);
    const Find6no = x.cardNo.includes(card6no);

    const card8no = String(request?.body?.cardNo).replace('-', '').slice(0, 8);
    const Find8no = x.cardNo.includes(card8no);

    if (Find6no == true || Find8no == true) {
      returnData = { cardNm: x.cardNm, cardNo: request?.body?.cardNo };
    }
  });

  if (!returnData) {
    reply.code(400);
    return { code: 400, message: 'Bad Request' };
  }
  return returnData;
});

app.post('/cardtype/update', async (request: any, reply: FastifyReply) => {
  let returnData: any = [];

  request?.body?.data.map((x: any) => {
    const splitData = x.split('|');

    const finddata = returnData.findIndex((x: any) => x.cardNm == splitData[1]);
    console.log(finddata);

    if (finddata == -1) {
      returnData.push({
        cardNm: splitData[1],
        cardNo: [splitData[0]],
      });
    } else {
      returnData[finddata].cardNo.push(splitData[0]);
    }
  });

  return returnData;
});

app.post('/rice/line', async (request: any, reply: FastifyReply) => {
  console.log(request.body.events[0]);
  let returnHtml = '';

  // await axios
  //   .get('https://www.hanyang.ac.kr/web/www/re11')
  //   .then(function (response) {
  //     // 성공 핸들링
  //     returnHtml +=
  //       response.data.split('<h3>')[1].split('</h3>')[0].trim() +
  //       `(\\${response.data.split(`class="price">`)[1].split('</p>')[0]})\n`;
  //     returnHtml +=
  //       ' - ' +
  //       response.data
  //         .split('<h3>')[2]
  //         .split('</h3>')[0]
  //         .split('[')[1]
  //         .split(']')[1]
  //         .trim()
  //         .split(', ')
  //         .join('\n - ');

  //     returnHtml += '\n\n';
  //   })

  //   .catch(function (error) {
  //     console.log(
  //       'Fail to get https://www.hanyang.ac.kr/web/www/re11 :' + error.code,
  //     );

  //     returnHtml +=
  //       error.code == undefined
  //         ? '오늘은 메뉴가 없는거 같아요! <a href="https://www.hanyang.ac.kr/web/www/re11" target="_blank">사이트</a>에서 확인해주세요!'
  //         : `오..이런.. 오류가 난거같아요 새로고침 해주세요!: ${error.code} `;
  //     returnHtml += '\n\n';
  //   });

  // await axios
  //   .get('https://www.hanyang.ac.kr/web/www/re12')
  //   .then(function (response) {
  //     // 성공 핸들링
  //     returnHtml +=
  //       response.data.split('<h3>')[1].split('</h3>')[0].trim() +
  //       `(\\${
  //         response.data.split(`class="price">`)[1].split('</p>')[0]
  //       } | 택 1)\n`;

  //     returnHtml +=
  //       ' - ' +
  //       response.data
  //         .split('<h3>')[2]
  //         .split('</h3>')[0]
  //         .split('[')[1]
  //         .split(']')[1]
  //         .trim()
  //         .split(', ')
  //         .join('\n');

  //     returnHtml +=
  //       '\n - ' +
  //       response.data
  //         .split('<h3>')[3]
  //         .split('</h3>')[0]
  //         .split('[')[1]
  //         .split(']')[1]
  //         .trim()
  //         .split(', ')
  //         .join('\n - ');

  //     returnHtml += '\n\n';
  //   })
  //   .catch(function (error) {
  //     console.log(
  //       'Fail to get https://www.hanyang.ac.kr/web/www/re12 :' + error.code,
  //     );

  //     returnHtml +=
  //       error.code == undefined
  //         ? '오늘은 메뉴가 없는거 같아요! <a href="https://www.hanyang.ac.kr/web/www/re12" target="_blank">사이트</a>에서 확인해주세요!'
  //         : `오..이런.. 오류가 난거같아요 새로고침 해주세요!: ${error.code} `;

  //     returnHtml += '\n\n';
  //   });

  // await axios
  //   .get('https://www.hanyang.ac.kr/web/www/re15')
  //   .then(function (response) {
  //     returnHtml +=
  //       response.data.split('<h3>')[1].split('</h3>')[0].trim() +
  //       `(\\${response.data.split(`class="price">`)[1].split('</p>')[0]})\n`;
  //     returnHtml +=
  //       ' - ' +
  //       response.data
  //         .split('<h3>')[2]
  //         .split('</h3>')[0]
  //         .split('[')[1]
  //         .split(']')[1]
  //         .trim()
  //         .split(', ')
  //         .join('\n - ');

  //     returnHtml += '\n\n';
  //   })
  //   .catch(function (error) {
  //     console.log(
  //       'Fail to get https://www.hanyang.ac.kr/web/www/re15 :' + error.code,
  //     );

  //     returnHtml +=
  //       error.code == undefined
  //         ? '오늘은 메뉴가 없는거 같아요! <a href="https://www.hanyang.ac.kr/web/www/re15" target="_blank">사이트</a>에서 확인해주세요!'
  //         : `오..이런.. 오류가 난거같아요 새로고침 해주세요!: ${error.code} `;
  //     returnHtml += '\n\n';
  //   });

  const client = new line.Client({
    channelAccessToken:
      'FrhlnKDz3xiik9hCWWCB4HE3K3y61eAj3gTEFWzJZJDcdYlapcwc1cdVtypTZFzS4PA74QYNA+fGpjh9ztWPMtT6EqNasQnvSPi4neQEghPOVzQozlDzeiubtsjP9URx1KbJ9w+aw44RCkh9fPl+FgdB04t89/1O/w1cDnyilFU=',
  });

  const message = {
    type: 'text',
    text: ['asas', returnHtml],
  };

  client
    .replyMessage(request.body.events[0].replyToken, message)
    .then(() => {})
    .catch((err: any) => {
      // error handling
    });
});

(async () => {
  await app.listen({ host: '::', port: PORT });
})();
