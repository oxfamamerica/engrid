import { SimpleEventDispatcher } from "strongly-typed-events";

export default class DonationAmount {
  private _onAmountChange = new SimpleEventDispatcher<number>();
  private _amount: number = 0;
  private _radios: string = "";
  private _other: string = "";
  private _dispatch: boolean = true;

  constructor(radios: string, other: string) {
    this._other = other;
    this._radios = radios;
    // Watch the Radios for Changes
    document.addEventListener("change", (e: Event) => {
      const element = e.target as HTMLInputElement;
      if (element && (element.name == radios || element.name == other)) {
        element.value = this.removeCommas(element.value);
        this.amount = parseFloat(element.value);
      }
    });
  }

  get amount(): number {
    return this._amount;
  }

  // Every time we set an amount, trigger the onAmountChange event
  set amount(value: number) {
    this._amount = value || 0;
    if (this._dispatch) this._onAmountChange.dispatch(this._amount);
  }

  public get onAmountChange() {
    return this._onAmountChange.asEvent();
  }

  // Set amount var with currently selected amount
  public load() {
    const currentAmountField = document.querySelector(
      'input[name="' + this._radios + '"]:checked'
    ) as HTMLInputElement;
    if (currentAmountField && currentAmountField.value) {
      let currentAmountValue = parseFloat(currentAmountField.value);

      if (currentAmountValue > 0) {
        this.amount = parseFloat(currentAmountField.value);
      } else {
        const otherField = document.querySelector(
          'input[name="' + this._other + '"]'
        ) as HTMLInputElement;
        currentAmountValue = parseFloat(otherField.value);
        this.amount = parseFloat(otherField.value);
      }
    }
  }
  // Force a new amount
  public setAmount(amount: number, dispatch: boolean = true) {
    // Run only if it is a Donation Page with a Donation Amount field
    // JI 20-Jan 2021 - changed this to ! because we want it to exit only if is NOT a donation form
    if (!document.getElementsByName("transaction.donationAmt").length) {
      return;
    }
    // Set dispatch to be checked by the SET method
    this._dispatch = dispatch;

    const transactionDonAmt = document.getElementsByName(
      "transaction.donationAmt"
      ) as NodeList;
    Array.from(transactionDonAmt).forEach(e => {
      let element = e as HTMLInputElement;
      //console.log("list of transaction.donationAmt");
      //console.log("element.value = "+element.value);
      //console.log("amount ="+amount);
    });
    // Search for the current amount on radio boxes
    let found = Array.from(document.querySelectorAll('input[name="' + this._radios + '"]')
    );
    let newAmountField;
    found.forEach(e =>{ 
      let element = e as HTMLInputElement;
      //console.log("found element.value = "+element.value);
      //console.log("found amount = "+amount);
      if(amount > 0 && parseInt(element.value) == amount){
        newAmountField = element;
        //console.log("newAmountField.value = "+ newAmountField.value);
        newAmountField.checked = true;
        this.clearOther();
      }
      else{
        if(amount > 0){
          if(element.checked){
          //console.log("checked element = "+element);
          //console.log("checked element value = "+element.value);
          element.checked = false;}
          const otherField = document.querySelector(
            'input[name="' + this._other + '"]'
          ) as HTMLInputElement;
          otherField.focus();
          otherField.value = parseFloat(amount.toString()).toFixed(2);
        }
      }
    });
    
    // Set the new amount and trigger all live variables
    //console.log("setAmount -> amount ="+ amount);
    this.amount = amount;
    // Revert dispatch to default value (true)
    this._dispatch = true;
  }
  // Clear Other Field
  public clearOther() {
    const otherField = document.querySelector(
      'input[name="' + this._other + '"]'
    ) as HTMLInputElement;
    otherField.value = "";
    const otherWrapper = otherField.parentNode as HTMLElement;
    otherWrapper.classList.add("en__field__item--hidden");
  }
 
  // Remove commas
  public removeCommas(v: string) {
    // replace 5,00 with 5.00
    if (v.length > 3 && v.charAt(v.length - 3) == ',') {
      v = v.substr(0, v.length - 3) + "." + v.substr(v.length - 2, 2);
    }
    else if (v.length > 2 && v.charAt(v.length - 2) == ',') {
      v = v.substr(0, v.length - 2) + "." + v.substr(v.length - 1, 1);
    }
    // replace any remaining commas
    return v.replace(/,/g, '');
  }
}
