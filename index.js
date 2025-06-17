import puppeteer from "puppeteer";
//handles file path ie.  index.html
import path from "path";

const SpeechRecognition = async () => {
    const browser = await puppeteer.launch({
        headless: false, // make if false to see the browser in action
        // defaultViewport: { width: 1920, height: 1080 },
        defaultViewport: null,
        args: ["--start-maximized", "--use-fake-ui-for-media-stream"], // to start the browser in maximized mode and allow microphone access in the browser
        permissions: ["microphone"], // to allow microphone access in the browser
    });
    const page = await browser.newPage();
    const indexHtmlPath = path.resolve("index.html");
    await page.goto(`file://${indexHtmlPath}`);
    await page.click("#start");

    console.log("Listening...");

    while (true) {
        try {
            const text = await page.evaluate(() => {
                const outputElement = document.getElementById("output");
                return outputElement ? outputElement.innerText : "";
            });

            if (text) {
                console.log(text);
                await page.evaluate(() => {
                    const outputElement = document.getElementById("output");
                    outputElement.innerText = "";
                });
            } else {
                
                await page.evaluate(() => {
                    return new Promise((resolve) => {
                        setTimeout(resolve, 222); // Waits for 1000 milliseconds (1 second)
                    });
                });
            }
        } catch (e) {
            console.log(e);
        }
    }
};

SpeechRecognition();

// Handle Ctrl+C (SIGINT) to close Puppeteer gracefully
process.on("SIGINT", async () => {
    console.log("\nGracefully shutting down Puppeteer...");
    if (browser) {
        await browser.close();
    }
    process.exit();
});
