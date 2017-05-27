import { PlusMinusAngularPage } from './app.po';

describe('plus-minus-angular App', () => {
  let page: PlusMinusAngularPage;

  beforeEach(() => {
    page = new PlusMinusAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
