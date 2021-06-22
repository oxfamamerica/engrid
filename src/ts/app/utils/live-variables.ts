import DonationAmount from "../events/donation-amount";
import DonationFrequency from "../events/donation-frequency";
import ProcessingFees from "../events/processing-fees";
import Postcode from "../events/postcode-lookup";
import { setDonationAmountLevels } from "../utils/custom-methods";
import { watchRecurrpayField } from "../utils/custom-methods";

import { amount } from "../index";
import { frequency } from "../index";
import { fees } from "../index";
import { form } from "../index";
import { postcode } from "../index";

export default class LiveVariables {
  public _amount: DonationAmount;
  public _fees: ProcessingFees;
  public _postcode: Postcode;
  private _frequency: DonationFrequency;
  //private multiplier: number = 1 / 12;
  private multiplier: number = 1 / 1;

  constructor(submitLabel: string, feesLabel: string) {
    this._amount = amount;
    this._frequency = frequency;
    this._fees = fees;
    this._postcode = postcode;
    amount.onAmountChange.subscribe(() => this.changeSubmitButton(submitLabel));
    amount.onAmountChange.subscribe(() => this.changeFeesLabel(feesLabel));
    amount.onAmountChange.subscribe(() => this.changeLiveAmount());
    amount.onAmountChange.subscribe(() => this.changeLiveUpsellAmount());
    fees.onFeeChange.subscribe(() => this.changeLiveAmount());
    fees.onFeeChange.subscribe(() => this.changeLiveUpsellAmount());
    fees.onFeeChange.subscribe(() => this.changeSubmitButton(submitLabel));
    fees.onFeeChange.subscribe(() => this.changeFeesLabel(feesLabel));
    frequency.onFrequencyChange.subscribe(() => this.changeLiveFrequency());
    frequency.onFrequencyChange.subscribe(() =>
      this.changeSubmitButton(submitLabel)
    );
    frequency.onFrequencyChange.subscribe(() => this.changeFeesLabel(feesLabel));
    frequency.onFrequencyChange.subscribe(() => this.changeDonationLevels(frequency.frequency));
    frequency.onFrequencyChange.subscribe(() => this.changeLiveAmount());
    frequency.onFrequencyChange.subscribe((s) => amount.setAmount(amount.amount));
    
    postcode.onPostcodeChange.subscribe(() => this.changePostcode());
    form.onSubmit.subscribe(() => this.loadingSubmitButton());
    form.onError.subscribe(() => this.changeSubmitButton(submitLabel));

    // Watch the monthly-upsell links
    document.addEventListener("click", (e: Event) => {
      const element = e.target as HTMLInputElement;
      let modalProgressMessage = document.getElementById("modalProgressMessage");
      let enModal = document.getElementById("enModal");

      if (element) {
        if (element.classList.contains("monthly-upsell")) {
          this.upsold(e);
          if(enModal && enModal.classList.contains("upsellModal")){
            enModal.classList.add("in-progress");
          }
        } else if (element.classList.contains("form-submit")) {
          e.preventDefault();
          if(enModal && enModal.classList.contains("upsellModal")){
            enModal.classList.add("in-progress");
          }
          form.submitForm();

        }
      }
    });
  }

  private getAmountTxt(amount: number = 0) {
    const amountTxt = Number.isInteger(amount)
      ? "$" + amount
      : "$" + amount.toFixed(2);
    return amount > 0 ? amountTxt : "";
  }

  /*private getUpsellAmountTxt(amount: number = 0) {
    const amountTxt = "$" + Math.ceil(amount / 5) * 5;
    return amount > 0 ? amountTxt : "";
  }

  private getUpsellAmountRaw(amount: number = 0) {
    const amountRaw = Math.ceil(amount / 5) * 5;
    return amount > 0 ? amountRaw.toString() : "";
  }*/

  private getUpsellAmountTxt(amount: number = 0) {
    let amountRaw = 5;
    if(amount >= 25){
      amountRaw = Math.round(amount * 0.2);
      //console.log("Txt amountRaw greater $25 is "+amountRaw);
    }
    const amountTxt = "$" + amountRaw;
    //console.log("amount is "+amount);
    //console.log("amountTxt is "+amountTxt);
    return amount > 0 ? amountTxt : "";
  }
  private getUpsellAmountRaw(amount: number = 0){
    let amountRaw = 5;
    if(amount >= 25){
      amountRaw = Math.round(amount * 0.2);
      //console.log("amountRaw greater $25 is "+amountRaw);
    }
    //console.log("amountRaw is "+amountRaw);
    return amount > 0 ? amountRaw.toString() : "";
  }

  public changeSubmitButton(submitLabel: string) {
    const submit = document.querySelector(
      ".dynamic-giving-button button"
    ) as HTMLButtonElement;
    const amount = this.getAmountTxt(this._amount.amount + this._fees.fee);

    if (amount) {
      const frequency = this._frequency.frequency == "single" ? " now" : "/month";
      const label =
        amount != ""
          ? submitLabel + " " + amount + frequency
          : submitLabel + " now";
      submit.innerHTML = label;
    }
  }
  public changeFeesLabel(feesLabel: string) {
    const amount = this.getAmountTxt(this._amount.amount + this._fees.processingFee);
    const feeTotalDonationAmount = document.querySelector('#total_donation_amount');

    if (amount) {
      const frequency = this._frequency.frequency == "single" ? "" : "/month";
      const label =
        amount != ""
          ? feesLabel + " " + amount + frequency 
          : feesLabel + " " + amount;
      if(feeTotalDonationAmount) {feeTotalDonationAmount.innerHTML = label;}
    }
  }
  public loadingSubmitButton() {
    const submit = document.querySelector(
      ".en__submit button"
    ) as HTMLButtonElement;
    let submitButtonOriginalHTML = submit.innerHTML;
    let submitButtonProcessingHTML =
      "<span class='loader-wrapper'><span class='loader loader-quart'></span><span class='submit-button-text-wrapper'>" +
      submitButtonOriginalHTML +
      "</span></span>";
    submitButtonOriginalHTML = submit.innerHTML;
    submit.innerHTML = submitButtonProcessingHTML;
    return true;
  }

  public changeLiveAmount() {
    const value = this._amount.amount + this._fees.fee;
    const live_amount = document.querySelectorAll(".live-giving-amount");
    live_amount.forEach(elem => (elem.innerHTML = this.getAmountTxt(value)));
  }

  public changeLiveUpsellAmount() {
    const value = (this._amount.amount + this._fees.fee) * this.multiplier;
    const live_upsell_amount = document.querySelectorAll(
      ".live-giving-upsell-amount"
    );

    live_upsell_amount.forEach(
      elem => (elem.innerHTML = this.getUpsellAmountTxt(value))
    );

    const live_upsell_amount_raw = document.querySelectorAll(
      ".live-giving-upsell-amount-raw"
    );
    live_upsell_amount_raw.forEach(
      elem => (elem.innerHTML = this.getUpsellAmountRaw(value))
    );
  }

  public changeLiveFrequency() {
    const live_frequency = document.querySelectorAll(".live-giving-frequency");
    live_frequency.forEach(
      elem =>
        (elem.innerHTML =
          this._frequency.frequency == "single" ? "" : "monthly")
    );
  }
  public changePostcode(){
    console.log("zip has changed, look it up");
  }
  public changeDonationLevels(frequency: string) {
    //console.log("change donation Levels ");
    setDonationAmountLevels(frequency);    
  }

  // Watch for a clicks on monthly-upsell link
  private upsold(e: Event) {
    // Find and select monthly giving
    const enFieldRecurrpay = document.querySelector(
      ".en__field--recurrpay input[value='Y']"
    ) as HTMLInputElement;
    if (enFieldRecurrpay) {
      enFieldRecurrpay.checked = true;
    }
    watchRecurrpayField();
    // Find the hidden radio select that needs to be selected when entering an "Other" amount
    const enFieldOtherAmountRadio = document.querySelector(
      ".en__field--donationAmt input[value='other']"
    ) as HTMLInputElement;
    if (enFieldOtherAmountRadio) {
      enFieldOtherAmountRadio.checked = true;
    }

    // Enter the other amount and remove the "en__field__item--hidden" class from the input's parent
    const enFieldOtherAmount = document.querySelector(
      "input[name='transaction.donationAmt.other']"
    ) as HTMLInputElement;
    if (enFieldOtherAmount) {
      // @TODO Needs to use getUpsellAmountRaw to set value

      enFieldOtherAmount.value = this.getUpsellAmountRaw(
        this._amount.amount * this.multiplier
      );
      amount.load();
      frequency.load();
      if (enFieldOtherAmount.parentElement) {
        enFieldOtherAmount.parentElement.classList.remove(
          "en__field__item--hidden"
        );
      }
    }

    const target = e.target as HTMLLinkElement;
    if (target && target.classList.contains("form-submit")) {
      e.preventDefault();
      // Form submit
      form.submitForm();
    }
  }
}
