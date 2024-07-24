const page = require('../../page');
const helper = require('../../helper')

const fromAddress = 'East 2nd Street, 601';
const toAddress = '1300 1st St';
const message = 'Bring me a JavaScript studybook, please';
const iceCreamCount = 2;

describe('Create an order', () => {
    it('should set addresses correctly', async () => {
        await browser.url(`/`);
        await page.fillAddresses(fromAddress, toAddress);

        const fromFieldValue = await $(page.fromField).getValue();
        const toFieldValue = await $(page.toField).getValue();

        const isFilledCorrectly = fromFieldValue === fromAddress && toFieldValue === toAddress;
        await expect(isFilledCorrectly).toBe(true);
    })

    it('should select supportive plan', async () => {
        await browser.url(`/`);
        await page.fillAddresses(fromAddress, toAddress);
        await page.callATaxi();
       
        if (!(await page.isSupportivePlanSelected())) {
            await page.selectSupportivePlan();
        }

        await expect(await page.isSupportivePlanSelected()).toBe(true);
    })

    it('should fill phone number', async () => {
        await browser.url(`/`);
        await page.fillAddresses(fromAddress, toAddress);
        await page.callATaxi();

        const phoneNumber = helper.getPhoneNumber("+1");
        await page.submitPhoneNumber(phoneNumber);

        await expect(await helper.getElementByText(phoneNumber)).toBeExisting();
    })

    it('should add a credit card', async () => {
        await browser.url(`/`);
        await page.fillAddresses(fromAddress, toAddress);
        await page.callATaxi();
        await page.addCard(123400004321, 12);

        const cardRow = await $(page.cardRow);
        await cardRow.waitForDisplayed();

        await expect(cardRow).toBeDisplayed();
    })

    it('should write a message to the driver', async () => {
        await browser.url(`/`);
        await page.fillAddresses(fromAddress, toAddress);
        await page.callATaxi();
        await page.fillMessageToTheDriver(message);

        const messageToTheDriverField = await $(page.messageToTheDriverField);
        await messageToTheDriverField.waitForDisplayed();

        await expect(await messageToTheDriverField.getValue()).toBe(message);
    })

    it('should select a blanket and handkerchiefs', async () => {
        await browser.url(`/`);
        await page.fillAddresses(fromAddress, toAddress);
        await page.callATaxi();

        if (!(await page.isSupportivePlanSelected())) {
            await page.selectSupportivePlan();
        }
        
        if (!(await page.isBlanketAndHandkerchiefsSwitchInputChecked())) {
            await page.selectBlanketsAndHandkerchief();
        }

        await expect(await page.isBlanketAndHandkerchiefsSwitchInputChecked()).toBe(true);
    })

    it('should add two ice creams', async () => {
        await browser.url(`/`);
        await page.fillAddresses(fromAddress, toAddress);
        await page.callATaxi();

        if (!(await page.isSupportivePlanSelected())) {
            await page.selectSupportivePlan();
        }

        if (await page.getIceCreamCount() === 0) {
            await page.addIceCream(iceCreamCount)
        };

        await expect(await page.getIceCreamCount()).toBe(iceCreamCount);
    })

    it('car search modal should appear', async () => {
        await browser.url(`/`)
        await page.fillAddresses(fromAddress, toAddress);
        await page.callATaxi();

        if (!(await page.isSupportivePlanSelected())) {
            await page.selectSupportivePlan();
        }

        const phoneNumber = helper.getPhoneNumber("+1");
        await page.submitPhoneNumber(phoneNumber);
        await page.addCard(123400004321, 12);
        await page.closeCardModal()
        await page.fillMessageToTheDriver(message);    
        
        if (!(await page.isBlanketAndHandkerchiefsSwitchInputChecked())) {
            await page.selectBlanketsAndHandkerchief();
        }
        
        if (await page.getIceCreamCount() === 0) {
            await page.addIceCream(iceCreamCount)
        };

        await page.clickOrderButton();

        const orderBody = await $(page.orderBody);
        await orderBody.waitForDisplayed();
        
        expect(orderBody).toBeDisplayed();
    })
    
    it('driver info should appear', async () => {
        await browser.url(`/`)
        await page.fillAddresses(fromAddress, toAddress);
        await page.callATaxi();

        if (!(await page.isSupportivePlanSelected())) {
            await page.selectSupportivePlan();
        }

        const phoneNumber = helper.getPhoneNumber("+1");
        await page.submitPhoneNumber(phoneNumber);
        await page.addCard(123400004321, 12);
        await page.closeCardModal()
        await page.fillMessageToTheDriver(message);    
        
        if (!(await page.isBlanketAndHandkerchiefsSwitchInputChecked())) {
            await page.selectBlanketsAndHandkerchief();
        }
        
        if (await page.getIceCreamCount() === 0) {
            await page.addIceCream(iceCreamCount)
        };

        await page.clickOrderButton();

        const orderBody = await $(page.orderBody);
        await orderBody.waitForDisplayed();
        
        const orderHeaderTime = await $(page.orderHeaderTime);

        await orderHeaderTime.waitUntil(async function() {
            return (await this.getText()) === "00:01";
        }, {timeout: 60000});

        const theDriverWillArriveLabel = await $(page.theDriverWillArriveLabel);
        theDriverWillArriveLabel.waitForDisplayed();

        expect(theDriverWillArriveLabel).toBeDisplayed();
    })
})

