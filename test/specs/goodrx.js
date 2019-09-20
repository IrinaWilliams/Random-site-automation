const { expect } = require('chai');

const URL = 'https://www.goodrx.com/';
const drugName = 'Amoxicillin';
const searchInputSelector = '//div[@class="search-wrap"]//input[@name="drug-name"]';
const searchDropdownFirstResult = '//div[@class="search-wrap"]//ul[@class="typeahead dropdown-menu"]/li[1]';

const drugPagePrescriptionSettingsSelector = '//div[@aria-label="Prescription Settings"]';
const drugPageRows = '//div[@id="a11y-prices-start"]//button[contains(text(), "Get free")]/../..';

describe('Amoxicillin', () => {
  before(() => {
    browser.url(URL);
    // Set cookies to be trusted user
    browser.setCookies([
      { name: 'grx_internal_user', value: 'true' },
    ]);
    browser.refresh();
  });

  it('Should open the main page with correct h1', () => {
    const h1Text = $('//h1').getText();
    const h1TextExpected = 'Stop paying too much for your prescriptions';
    expect(h1Text).to.eq(h1TextExpected);
  });

  it('Should open the main page with search input', () => {
    const searchInputIsDisplayed = $(searchInputSelector).isDisplayed();
    expect(searchInputIsDisplayed).to.be.true;
  });

  it('Should type drug name into search input', () => {
    const searchInput = $(searchInputSelector);
    searchInput.setValue(drugName);
    $(searchDropdownFirstResult).click();

  });

  it('Should check price page for correct drug name', () => {
    const h1Text = $('//h1/a').getText();
    expect(h1Text).to.eq(drugName);
  });

  it('Should check price page for Prescription Settings is displayed', () => {
    const prescriptionSettingsIsDisplayed = $(drugPagePrescriptionSettingsSelector).isDisplayed();
    expect(prescriptionSettingsIsDisplayed).to.be.true;
  });

  it('Should check every price row', () => {
    const allStoreRows = $$(drugPageRows);
    const currentWindowId = browser.getWindowHandles()[0];
    let mainWindowDrugPrice, mainWindowStoreName, buttonCoupon;

    const modalPostCoupon = $('//div[@id="modal-PostCoupon"]//span[@role="button"]');
      if (!modalPostCoupon.error && modalPostCoupon.isDisplayed()) {
      modalPostCoupon.click();
    }

    const modalHeyDoctor = $('//div[@id="modal-heyDoctorModal"]//button[@aria-label="click to close modal"]');
      if (!modalHeyDoctor.error && modalHeyDoctor.isDisplayed()) {
        modalHeyDoctor.click();
      }

      allStoreRows.forEach(row => {
      mainWindowDrugPrice = row.$('.//div[@data-qa="drug_price"]').getText().split('\n')[1].substring(1);
      mainWindowStoreName = row.$('.//div[@data-qa="store_name"]').getText().split('\n')[1];
      buttonCoupon = row.$('.//button[@data-qa="coupon_button"]');
      buttonCoupon.click();

      const handles = browser.getWindowHandles();
      const newTabId = handles.filter(el => el !== currentWindowId)[0];

      if (newTabId) {
        browser.switchToWindow(newTabId);
        const drugPriceNewWindow = $('//div[@class="price-info"]//span').getText();
        const storeNameNewWindow = $('//div[@class="explanation"]//strong').getText();
        expect(storeNameNewWindow).to.be.eq(mainWindowStoreName);
        expect(drugPriceNewWindow).to.eq(mainWindowDrugPrice);
        browser.closeWindow();
        browser.switchToWindow(currentWindowId);
      }
    });
  });
});