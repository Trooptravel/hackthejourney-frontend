
// https://gist.github.com/orenitamar/3207618
const CONTINENT_COUNTRY_CODES = {
  AF:"AS",AL:"EU",AQ:"AN",DZ:"AF",AS:"OC",AD:"EU",AO:"AF",AG:"NA",AZ:"AS",AR:"SA",
  AU:"OC",AT:"EU",BS:"NA",BH:"AS",BD:"AS",AM:"AS",BB:"NA",BE:"EU",BM:"NA",BT:"AS",
  BO:"SA",BA:"EU",BW:"AF",BV:"AN",BR:"SA",BZ:"NA",IO:"AS",SB:"OC",VG:"NA",BN:"AS",
  BG:"EU",MM:"AS",BI:"AF",BY:"EU",KH:"AS",CM:"AF",CA:"NA",CV:"AF",KY:"NA",CF:"AF",
  LK:"AS",TD:"AF",CL:"SA",CN:"AS",TW:"AS",CX:"AS",CC:"AS",CO:"SA",KM:"AF",YT:"AF",
  CG:"AF",CD:"AF",CK:"OC",CR:"NA",HR:"EU",CU:"NA",CY:"AS",CZ:"EU",BJ:"AF",DK:"EU",
  DM:"NA",DO:"NA",EC:"SA",SV:"NA",GQ:"AF",ET:"AF",ER:"AF",EE:"EU",FO:"EU",FK:"SA",
  GS:"AN",FJ:"OC",FI:"EU",AX:"EU",FR:"EU",GF:"SA",PF:"OC",TF:"AN",DJ:"AF",GA:"AF",
  GE:"AS",GM:"AF",PS:"AS",DE:"EU",GH:"AF",GI:"EU",KI:"OC",GR:"EU",GL:"NA",GD:"NA",
  GP:"NA",GU:"OC",GT:"NA",GN:"AF",GY:"SA",HT:"NA",HM:"AN",VA:"EU",HN:"NA",HK:"AS",
  HU:"EU",IS:"EU",IN:"AS",ID:"AS",IR:"AS",IQ:"AS",IE:"EU",IL:"AS",IT:"EU",CI:"AF",
  JM:"NA",JP:"AS",KZ:"AS",JO:"AS",KE:"AF",KP:"AS",KR:"AS",KW:"AS",KG:"AS",LA:"AS",
  LB:"AS",LS:"AF",LV:"EU",LR:"AF",LY:"AF",LI:"EU",LT:"EU",LU:"EU",MO:"AS",MG:"AF",
  MW:"AF",MY:"AS",MV:"AS",ML:"AF",MT:"EU",MQ:"NA",MR:"AF",MU:"AF",MX:"NA",MC:"EU",
  MN:"AS",MD:"EU",ME:"EU",MS:"NA",MA:"AF",MZ:"AF",OM:"AS",NA:"AF",NR:"OC",NP:"AS",
  NL:"EU",AN:"NA",CW:"NA",AW:"NA",SX:"NA",BQ:"NA",NC:"OC",VU:"OC",NZ:"OC",NI:"NA",
  NE:"AF",NG:"AF",NU:"OC",NF:"OC",NO:"EU",MP:"OC",UM:"NA",FM:"OC",MH:"OC",PW:"OC",
  PK:"AS",PA:"NA",PG:"OC",PY:"SA",PE:"SA",PH:"AS",PN:"OC",PL:"EU",PT:"EU",GW:"AF",
  TL:"AS",PR:"NA",QA:"AS",RE:"AF",RO:"EU",RU:"AS",RW:"AF",BL:"NA",SH:"AF",KN:"NA",
  AI:"NA",LC:"NA",MF:"NA",PM:"NA",VC:"NA",SM:"EU",ST:"AF",SA:"AS",SN:"AF",RS:"EU",
  SC:"AF",SL:"AF",SG:"AS",SK:"EU",VN:"AS",SI:"EU",SO:"AF",ZA:"AF",ZW:"AF",ES:"EU",
  SS:"AF",EH:"AF",SD:"AF",SR:"SA",SJ:"EU",SZ:"AF",SE:"EU",CH:"EU",SY:"AS",TJ:"AS",
  TH:"AS",TG:"AF",TK:"OC",TO:"OC",TT:"NA",AE:"AS",TN:"AF",TR:"EU",TM:"AS",TC:"NA",
  TV:"OC",UG:"AF",UA:"EU",MK:"EU",EG:"AF",GB:"EU",GG:"EU",JE:"EU",IM:"EU",TZ:"AF",
  US:"NA",VI:"NA",BF:"AF",UY:"SA",UZ:"AS",VE:"SA",WF:"OC",WS:"OC",YE:"AS",ZM:"AF",
  XX:"OC",XE:"AS",XD:"AS",XS:"AS"};

const CONTINENT_CODES = {AF:"Africa",AS:"Asia",EU:"Europe",NA:"North America",SA:"South America",OC:"Oceania",AN:"Antarctica"};

function address(addressData, placeResultData) {
  const fields = ['place_id', 'icon', 'rating', 'website', 'formatted_phone_number', 'html_attributions', 'name'];
  let address = addressData;
  if (placeResultData.photos !== undefined) {
    if (placeResultData.photos.length > 0) {
      let photo = placeResultData.photos[0].getUrl({ 'maxWidth': 300, 'maxHeight': 300 });
      address.photo = photo;
    }
  }
  var i = 0;
  for (i = 0; i < fields.length; i++) {
    let field = fields[i];
    if (placeResultData[field] !== undefined) {
      address[field] = placeResultData[field]
    }
  }
  let country = '';
  let country_code = '';
  for (i = 0 ; i < placeResultData.address_components.length ; i ++ ) {
    let component = placeResultData.address_components[i];
    if (component.types.indexOf('country') !== -1) {
      country      = component.long_name;
      country_code = component.short_name;
      break;
    }
  }

  let city = '';
  for (i = 0 ; i < placeResultData.address_components.length ; i ++ ) {
    let component = placeResultData.address_components[i];
    if (component.types.indexOf('locality') !== -1) {
      city = component.long_name;
      break;
    }
  }

  let meeting_address = placeResultData.formatted_address;
  address.meeting_address = meeting_address;
  address.city            = city;
  address.country         = country;
  address.country_code    = country_code;
  return address;
}


function continent(countryCode) {
  let upperCode = countryCode.toUpperCase();
  return  CONTINENT_COUNTRY_CODES[upperCode]
}


function continent_name(continentCode) {
  let upperCode = continentCode.toUpperCase();
  return  CONTINENT_CODES[upperCode]
}


window.form = {};
window.form.address = address;
window.form.continent = continent;
window.form.continent_name = continent_name;
