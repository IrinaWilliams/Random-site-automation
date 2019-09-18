const { expect } = require('chai');
const drugName = 'Amoxicillin';
const searchInputSelector = '//div[@class="search-wrap"]//input[@name="drug-name"]';
const searchDropdownFirstResult = '//div[@class="search-wrap"]//ul[@class="typeahead dropdown-menu"]/li[1]';
const drugPagePrescriptionSettingsSelector = '//div[@aria-label="Prescription Settings"]';
const drugPageRows = '//div[@id="a11y-prices-start"]//button[contains(text(), "Get free")]/../..';

describe('Amoxicillin', () => {
  before(() => {
    browser.url('https://www.goodrx.com/');
    // Set cookies to be trusted user
    browser.setCookies([
      { name: 'grx_internal_user', value: 'true' },
    ]);

    browser.refresh();
  });


  it('should open the main page with correct h1', () => {
    const h1Text = $('//h1').getText();
    const h1TextExpected = 'Stop paying too much for your prescriptions';
    expect(h1Text).to.eq(h1TextExpected);
  });

  it('should open the main page with search input', () => {
    const searchInputIsDisplayed = $(searchInputSelector).isDisplayed();
    expect(searchInputIsDisplayed).to.be.true;
  });

  it('should type drug name into search input', () => {
    const searchInput = $(searchInputSelector);
    searchInput.setValue(drugName);
    $(searchDropdownFirstResult).click();
  });

  it('should check price page for correct drug name', () => {
    const h1Text = $('//h1/a').getText();
    expect(h1Text).to.eq(drugName);
  });

  it('should check price page for Prescription Settings is displayed', () => {
    const prescriptionSettingsIsDisplayed = $(drugPagePrescriptionSettingsSelector).isDisplayed();
    expect(prescriptionSettingsIsDisplayed).to.be.true;
  });

  it('should check every price row', () => {
    const allRows = $$(drugPageRows);
    console.log(allRows);
    for (let i = 0; i < allRows.length; i++){
      const rowPrice = allRows[i].$('//div[@data-qa="drug_price"]');
      const buttonCoupon = allRows[i].$('//button');
      buttonCoupon.click();
      console.log(rowPrice);
    }
    // browser.debug();
  
  });

});
