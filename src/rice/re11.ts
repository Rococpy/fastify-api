import axios from 'axios';
import axiosRetry from 'axios-retry';

export const re11 = async () => {
  let returnHtml = '';

  axiosRetry(axios, { retries: 3 });

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
          : `앗.. 오류가 났어요! 다시 요청해주세요!: ${error.code} `;

      returnHtml += '\n\n';
    });

  return returnHtml;
};
