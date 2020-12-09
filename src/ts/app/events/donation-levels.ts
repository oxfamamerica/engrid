/*import DonationAmount from "./donation-amount";
import getUrlParameter from "../utils/query-string";

import { SimpleEventDispatcher } from "strongly-typed-events";

export default class DonationLevels {
  private _onDonationLevelsChange = new SimpleEventDispatcher<number>();
  
  public _donationAmountLevels = "";
  public _windowDonationAmt = "";
  
  private _donationLevelAmtOnetime: Array<number> = dAmtOnetime;
  private _donationLevelAmtMonthly: Array<number> = dAmtMonthly;
  private _wDonationLevelAmt = window.wDonationLevelAmt;
  private _wDonationLevelAmtMonthly = window.wDonationLevelAmtMonthly;
  private _hpcQuery = getUrlParameter("hpc");
  private _field: HTMLInputElement | null = document.querySelector(
    'input[name="transaction.recurrpay"]'
  );

  private _subscribe?: () => void;

  constructor() {
    // Run only if it is a Donation Page with a Donation Amount field
    if (!document.getElementsByName("transaction.donationAmt").length) {
      return;
    }
    // Watch the Radios for Changes
    if (this._field instanceof HTMLInputElement) {
      // console.log('%c Change in recurrpay', 'font-size: 30px; background-color: #000; color: #FF0');
      this._field.addEventListener("change", (e: Event) => {
        if (
          this._field instanceof HTMLInputElement &&
          !this._subscribe
        ) {
          this._subscribe = form.onSubmit.subscribe(() => this.changeLevels());
        }
        this._onDonationLevelsChange.dispatch(this.fee);
        // // console.log('%c Donation Levels Script Applied', 'font-size: 30px; background-color: #000; color: #FF0');
      });
    }

    // this._amount = amount;
  }
  public get onDonationLevelsChange() {
    return this._onDonationLevelsChange.asEvent();
  }
  get fee(): number {
    return this.calculateFees();
  }

  // Every time we set a fee, trigger the onFeeChange event
  set fee(value: number) {
    this._fee = value;
    this._onDonationLevelsChange.dispatch(this._fee);
  }
  get processingFee(): number{
    return this.calculateProcessingFees();
  }


  private calculateFees() {
    if (
      this._field instanceof HTMLInputElement &&
      this._field.checked &&
      "dataset" in this._field
    ) {
      const fees = {
        ...{
          processingfeepercentadded: "0",
          processingfeefixedamountadded: "0"
        },
        ...this._field.dataset
      };
      const processing_fee =
        (parseFloat(fees.processingfeepercentadded) / 100) *
        this._amount.amount +
        parseFloat(fees.processingfeefixedamountadded);
      return Math.round(processing_fee * 100) / 100;
    }
    return 0;
  }
  private calculateProcessingFees() {
    if (
      this._field instanceof HTMLInputElement &&
      "dataset" in this._field
    ) {
      const fees = {
        ...{
          processingfeepercentadded: "0",
          processingfeefixedamountadded: "0"
        },
        ...this._field.dataset
      };
      const processing_fee =
        (parseFloat(fees.processingfeepercentadded) / 100) *
        this._amount.amount +
        parseFloat(fees.processingfeefixedamountadded);
      return Math.round(processing_fee * 100) / 100;
    }
    return 0;
  }

  // Add Fees to Amount
  private changeLevels() {
    
  }
  
}
*/