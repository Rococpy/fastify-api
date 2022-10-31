import { re11 } from '../rice/re11';
import { re12 } from '../rice/re12';
import { re15 } from '../rice/re15';

import { FastifyReply } from 'fastify';

const line = require('@line/bot-sdk');

function shuffle(array: any) {
  array.sort(() => Math.random() - 0.5);
}

export const KoLine = async (request: any, reply: FastifyReply) => {
  const requestText = request.body.events[0].message.text;
  let returnHtml = '';

  if (requestText == '/도움') {
    returnHtml +=
      '선 & 빠르게 \n\n/밥|밥줘|학|학식\n/무작위 [항목1, 항목2]\n/사다리 [항목1, 항목2, ...] [인원1, 인원2, ...]\n - 주의! 항목 수와 인원 수는 동일하게 작성해주세요!\n\n이 녀석은 고장나면 답을 안주니 참고';
  }

  if (requestText == '/한글날') {
    returnHtml +=
      '한글날엔 일부 명령어가 변경됩니다! \n오늘 만큼은 /도움 으로 명령어를 확인해보세요!';
  }

  if (requestText == '/랜덤' || requestText == '/random') {
    returnHtml += '오늘만큼은 /무작위 명령어를 써보자구요!';
  }

  if (requestText == '/무작위') {
    returnHtml += '/무작위 [항목1, 항목2]';
  }

  if (requestText.includes('/무작위 ')) {
    const rmprefix = requestText.includes('/무작위')
      ? requestText.split('/무작위 ')
      : '';

    const a = rmprefix[1].split('[')[1].split(']')[0].split(',');

    returnHtml += `무작위 결과\n\n${a[
      Math.floor(Math.random() * a.length)
    ].trim()}`;
  }

  if (requestText == '/사다리') {
    returnHtml +=
      '/사다리 [항목1, 항목2, ...] [인원1, 인원2, ...]\n 주의! 항목 수와 인원 수는 동일하게 작성해주세요!';
  }

  if (requestText.includes('/사다리 ')) {
    const rmprefix = requestText.split('/사다리');

    const a = rmprefix[1].split(' [')[1].split(']')[0].split(',');
    const b = rmprefix[1].split(' [')[2].split(']')[0].split(',');

    console.log(a.length, b.length);

    if (a.length == b.length) {
      shuffle(a);
      shuffle(b);

      returnHtml += `사다리 결과\n`;

      a.map((x: any, i: number) => {
        returnHtml += `\n${x.trim()} => ${b[i].trim()}`;
      });
    } else {
      returnHtml = `[사다리] 항목과 인원의 수가 일치하지 않아요!`;
    }
  }

  if (
    requestText == '/밥' ||
    requestText == '/밥줘' ||
    requestText == '/학' ||
    requestText == '/학식'
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
