import { AngularTestPage } from './app.po';
import { browser, element, by } from 'protractor';

describe('Starting tests for digitalPropertyNetwork', function() {
  let page: AngularTestPage;

  beforeEach(() => {
    page = new AngularTestPage();
  });

  it('website title should be digitalPropertyNetwork', () => {
    page.navigateTo('/');
    return browser.getTitle().then((result)=>{
      expect(result).toBe('digitalPropertyNetwork');
    })
  });

  it('navbar-brand should be basic-sample-network@0.1.5',() => {
    var navbarBrand = element(by.css('.navbar-brand')).getWebElement();
    expect(navbarBrand.getText()).toBe('basic-sample-network@0.1.5');
  });

  
    it('SampleAsset component should be loadable',() => {
      page.navigateTo('/SampleAsset');
      var assetName = browser.findElement(by.id('assetName'));
      expect(assetName.getText()).toBe('SampleAsset');
    });

    it('SampleAsset table should have 4 columns',() => {
      page.navigateTo('/SampleAsset');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(4); // Addition of 1 for 'Action' column
      });
    });

  

});
