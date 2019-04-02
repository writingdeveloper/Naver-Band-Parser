'use strict';

const puppeteer = require('puppeteer'); // Puppeteer 모듈 Load
(async () => {
    const browser = await puppeteer.launch({ // Puppeteer 모듈을 사용하지 않고 기존의 크롬 사용자 정보를 사용 (Auth 인증을 패스하기 위하여)
        executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        userDataDir: 'C:\\Users\\SIHYEONGLEE\\AppData\\Local\\Google\\Chrome\\User Data', // 설치시 개인 크롬 Directory로 수정하여야함
        headless: true
    });
    const page = await browser.newPage(); // Broswer Open
    await page.setViewport({ // Viewport 설정 가로의 경우 일반적으로 최대 1920, 새로의 경우 예상되는 최대 px를 지정해주면됨
        width: 800,
        height: 6000
    });
    page.on('dialog', async dialog => { // 삭제된 게시글의 경우 Band에서 Dialog를 띄우는데 이를 제거하기 위하여 필요
        console.log(dialog.message());
        await dialog.dismiss(); // Dialog 창 닫음
        await postNumber++; // 삭제된 게시글의 경우 Dialog 창이 닫힌후에 이전 URL로 돌아가므로 postNumber 1증가 시켜줌
        await page.goto(`https://band.us/band/58075840/post/${postNumber}`, {
            waitUntil: 'networkidle0'
        });
    })
    let postNumber = 14565; // 시작되는 PostNumber * 이 부분 부터 시작 *
    while (postNumber <= 90000) { // PostNumber 끝값 * 이 부분은 마지막 값 *
        await page.goto(`https://band.us/band/58075840/post/${postNumber}`, {
            waitUntil: 'networkidle0' // 페이지가 완전히 Load된후 작동
        });

        let by = await page.evaluate(() => document.getElementsByClassName('text')[0].innerText); // 게시글 작성자 Text 파싱
        let date = await page.evaluate(() => document.getElementsByClassName('time')[0].innerText); // 게시글 작성일 Text 파싱
        let element = await page.$('.boardList'); // 게시글, 댓글 전체 Class
        await element.screenshot({ // ScreenShot Function
            path: `./image/${postNumber}-${by}-${date.replace(":","_")}.png` // 파일 저장 위치 & 파일이름 지정, replace 메소드의 경우 Windows 탐색기에서 :를 파일명으로 지원하지 않기때문
        });
        console.log(`${postNumber}-${by}-${date.replace(":","_")}.png`) // Console.log에서 파일 확인
        await postNumber++; // 최종 성공시 postnumber 증가
    }
    await browser.close(); // 종료
})();