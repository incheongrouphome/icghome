const fs = require('fs');
const path = require('path');

// 필요한 디렉토리 생성
const dirs = ['client/dist', 'client/dist/assets', 'dist'];
dirs.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
  console.log(`Created directory: ${dir}`);
});

// 프로덕션용 index.html 생성
const htmlContent = `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>인천광역시 그룹홈 협의회</title>
    <link rel="stylesheet" href="/assets/style.css" />
  </head>
  <body>
    <div id="root">
      <div class="container">
        <h1>인천광역시 그룹홈 협의회</h1>
        <p>사이트를 불러오고 있습니다...</p>
      </div>
    </div>
    <script src="/assets/main.js"></script>
  </body>
</html>`;

fs.writeFileSync('client/dist/index.html', htmlContent);
console.log('Created production index.html');

// 이미지 디렉토리 복사
if (fs.existsSync('client/src/img')) {
  fs.cpSync('client/src/img', 'client/dist/img', { recursive: true });
  console.log('Copied img directory');
}

// 기본 CSS 생성 (간단한 스타일)
const basicCSS = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  line-height: 1.6;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
`;

fs.writeFileSync('client/dist/assets/style.css', basicCSS);
console.log('Created basic CSS');

// 기본 JavaScript 생성
const basicJS = `
console.log('App loaded');
`;

fs.writeFileSync('client/dist/assets/main.js', basicJS);
console.log('Created basic JS');

console.log('Build completed successfully!'); 