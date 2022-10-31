import { FastifyReply, FastifyRequest, fastify } from 'fastify';

import dotenv from 'dotenv';

import { cardType } from './card';
import { re11 } from './rice/re11';
import { re12 } from './rice/re12';
import { re15 } from './rice/re15';

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

  returnHtml += await re11();
  returnHtml += await re12();
  returnHtml += await re15();

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

app.post('/line', async (request: any, reply: FastifyReply) => {});

(async () => {
  await app.listen({ host: '::', port: PORT });
})();
