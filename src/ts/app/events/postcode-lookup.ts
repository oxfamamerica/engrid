import { SimpleEventDispatcher } from "strongly-typed-events";


export default class Postcode{
  private _onPostcodeChange = new SimpleEventDispatcher<string>();
  private _postcode: string = "";
  private _dispatch: boolean = true;
  private _field: HTMLInputElement | null = document.querySelector(
    'input[name="supporter.postcode"]');
  private _state: HTMLInputElement | null = document.querySelector('select[name="supporter.region"]');
  

  constructor( postcode: string) {
    //console.log('%c Postcode Constructor', 'font-size: 30px; background-color: #000; color: #FF0');
    // Watch for changes
    if (this._field instanceof HTMLInputElement){
      this._field.addEventListener("change", (e: Event) =>{
        this._onPostcodeChange.dispatch(this.postcode);
        if(this._state != null){
            this.lookupPostcode(this._field!.value);
        }
        //console.log('%c Postcode change Applied', 'font-size: 30px; background-color: #000; color: #FF0');
      });
    }

  }


  get postcode(): string {
    return this._postcode;
  }

  // Every time we set a postcode, trigger the onPostcodeChange event
  set postcode(value: string) {
    this._postcode = value;
    this._onPostcodeChange.dispatch(this._postcode);
  }

  // Lookup Postcode
  public lookupPostcode(pc: string){
    $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDMjGYwrz9ZriAQ8dfJqQZZXgatG3J-9R0&address=' + pc).done(function(response){
      var city = "";
      var state = "";
      var country = "";
      var address_components = response.results[0].address_components;
      $.each(address_components, function(index, component){
        var types = component.types;
        $.each(types, function(index, type){
          if (type == 'locality'){
            city = component.long_name;
          }
          if (type == 'administrative_area_level_1'){
            state = component.short_name;
          }
          if (type == 'country'){
            country = component.short_name;
          }
        });
      });
      if (response.results[0].postcode_localities){
        city = 'false';
      }

      if (country == "US"){
        $("select[name='supporter.region']").val(state);
        if (city !== 'false')
        {
          $("input[name='supporter.city']").val(city);
        }
        console.log("done");
      }
    }); 
    return pc;
  }

  public get onPostcodeChange() {

    return this._onPostcodeChange.asEvent();
  }

  // Set postcode lookups
  public load() {
    const currentPostcodeField = document.querySelector(
      'input[name="' + this._postcode + '"]'
    ) as HTMLInputElement;
    if (currentPostcodeField && currentPostcodeField.value) {
      this.postcode = currentPostcodeField.value;
    }
  }
}


