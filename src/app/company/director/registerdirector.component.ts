import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'registerdirector.component.html',
  styleUrls: ['./registerdirector.component.scss'],
})
export class RegisterDirectorComponent {

  countries = [
    { value: "244", label: "Aaland Islands" },
    { value: "1", label: "Afghanistan" },
    { value: "2", label: "Albania" },
    { value: "3", label: "Algeria" },
    { value: "4", label: "American Samoa" },
    { value: "5", label: "Andorra" },
    { value: "6", label: "Angola" },
    { value: "7", label: "Anguilla" },
    { value: "8", label: "Antarctica" },
    { value: "9", label: "Antigua and Barbuda" },
    { value: "10", label: "Argentina" },
    { value: "11", label: "Armenia" },
    { value: "12", label: "Aruba" },
    { value: "13", label: "Australia" },
    { value: "14", label: "Austria" },
    { value: "15", label: "Azerbaijan" },
    { value: "16", label: "Bahamas" },
    { value: "17", label: "Bahrain" },
    { value: "18", label: "Bangladesh" },
    { value: "19", label: "Barbados" },
    { value: "20", label: "Belarus" },
    { value: "21", label: "Belgium" },
    { value: "22", label: "Belize" },
    { value: "23", label: "Benin" },
    { value: "24", label: "Bermuda" },
    { value: "25", label: "Bhutan" },
    { value: "26", label: "Bolivia" },
    { value: "245", label: "Bonaire, Sint Eustatius and Saba" },
    { value: "27", label: "Bosnia and Herzegovina" },
    { value: "28", label: "Botswana" },
    { value: "29", label: "Bouvet Island" },
    { value: "30", label: "Brazil" },
    { value: "31", label: "British Indian Ocean Territory" },
    { value: "32", label: "Brunei Darussalam" },
    { value: "33", label: "Bulgaria" },
    { value: "34", label: "Burkina Faso" },
    { value: "35", label: "Burundi" },
    { value: "36", label: "Cambodia" },
    { value: "37", label: "Cameroon" },
    { value: "38", label: "Canada" },
    { value: "251", label: "Canary Islands" },
    { value: "39", label: "Cape Verde" },
    { value: "40", label: "Cayman Islands" },
    { value: "41", label: "Central African Republic" },
    { value: "42", label: "Chad" },
    { value: "43", label: "Chile" },
    { value: "44", label: "China" },
    { value: "45", label: "Christmas Island" },
    { value: "46", label: "Cocos (Keeling) Islands" },
    { value: "47", label: "Colombia" },
    { value: "48", label: "Comoros" },
    { value: "49", label: "Congo" },
    { value: "50", label: "Cook Islands" },
    { value: "51", label: "Costa Rica" },
    { value: "52", label: "Cote D'Ivoire" },
    { value: "53", label: "Croatia" },
    { value: "54", label: "Cuba" },
    { value: "246", label: "Curacao" },
    { value: "55", label: "Cyprus" },
    { value: "56", label: "Czech Republic" },
    { value: "237", label: "Democratic Republic of Congo" },
    { value: "57", label: "Denmark" },
    { value: "58", label: "Djibouti" },
    { value: "59", label: "Dominica" },
    { value: "60", label: "Dominican Republic" },
    { value: "61", label: "East Timor" },
    { value: "62", label: "Ecuador" },
    { value: "63", label: "Egypt" },
    { value: "64", label: "El Salvador" },
    { value: "65", label: "Equatorial Guinea" },
    { value: "66", label: "Eritrea" },
    { value: "67", label: "Estonia" },
    { value: "68", label: "Ethiopia" },
    { value: "69", label: "Falkland Islands (Malvinas)" },
    { value: "70", label: "Faroe Islands" },
    { value: "71", label: "Fiji" },
    { value: "72", label: "Finland" },
    { value: "74", label: "France, Metropolitan" },
    { value: "75", label: "French Guiana" },
    { value: "76", label: "French Polynesia" },
    { value: "77", label: "French Southern Territories" },
    { value: "126", label: "FYROM" },
    { value: "78", label: "Gabon" },
    { value: "79", label: "Gambia" },
    { value: "80", label: "Georgia" },
    { value: "81", label: "Germany" },
    { value: "82", label: "Ghana" },
    { value: "83", label: "Gibraltar" },
    { value: "84", label: "Greece" },
    { value: "85", label: "Greenland" },
    { value: "86", label: "Grenada" },
    { value: "87", label: "Guadeloupe" },
    { value: "88", label: "Guam" },
    { value: "89", label: "Guatemala" },
    { value: "241", label: "Guernsey" },
    { value: "90", label: "Guinea" },
    { value: "91", label: "Guinea-Bissau" },
    { value: "92", label: "Guyana" },
    { value: "93", label: "Haiti" },
    { value: "94", label: "Heard and Mc Donald Islands" },
    { value: "95", label: "Honduras" },
    { value: "96", label: "Hong Kong" },
    { value: "97", label: "Hungary" },
    { value: "98", label: "Iceland" },
    { value: "99", label: "India" },
    { value: "100", label: "Indonesia" },
    { value: "101", label: "Iran (Islamic Republic of)" },
    { value: "102", label: "Iraq" },
    { value: "103", label: "Ireland" },
    { value: "104", label: "Israel" },
    { value: "105", label: "Italy" },
    { value: "106", label: "Jamaica" },
    { value: "107", label: "Japan" },
    { value: "240", label: "Jersey" },
    { value: "108", label: "Jordan" },
    { value: "109", label: "Kazakhstan" },
    { value: "110", label: "Kenya" },
    { value: "111", label: "Kiribati" },
    { value: "113", label: "Korea, Republic of" },
    { value: "114", label: "Kuwait" },
    { value: "115", label: "Kyrgyzstan" },
    { value: "116", label: "Lao People's Democratic Republic" },
    { value: "117", label: "Latvia" },
    { value: "118", label: "Lebanon" },
    { value: "119", label: "Lesotho" },
    { value: "120", label: "Liberia" },
    { value: "121", label: "Libyan Arab Jamahiriya" },
    { value: "122", label: "Liechtenstein" },
    { value: "123", label: "Lithuania" },
    { value: "124", label: "Luxembourg" },
    { value: "125", label: "Macau" },
    { value: "127", label: "Madagascar" },
    { value: "128", label: "Malawi" },
    { value: "129", label: "Malaysia" },
    { value: "130", label: "Maldives" },
    { value: "131", label: "Mali" },
    { value: "132", label: "Malta" },
    { value: "133", label: "Marshall Islands" },
    { value: "134", label: "Martinique" },
    { value: "135", label: "Mauritania" },
    { value: "136", label: "Mauritius" },
    { value: "138", label: "Mexico" },
    { value: "139", label: "Micronesia, Federated States of" },
    { value: "140", label: "Moldova, Republic of" },
    { value: "141", label: "Monaco" },
    { value: "142", label: "Mongolia" },
    { value: "242", label: "Montenegro" },
    { value: "143", label: "Montserrat" },
    { value: "144", label: "Morocco" },
    { value: "145", label: "Mozambique" },
    { value: "146", label: "Myanmar" },
    { value: "147", label: "Namibia" },
    { value: "148", label: "Nauru" },
    { value: "149", label: "Nepal" },
    { value: "150", label: "Netherlands" },
    { value: "151", label: "Netherlands Antilles" },
    { value: "152", label: "New Caledonia" },
    { value: "153", label: "New Zealand" },
    { value: "154", label: "Nicaragua" },
    { value: "155", label: "Niger" },
    { value: "156", label: "Nigeria" },
    { value: "157", label: "Niue" },
    { value: "158", label: "Norfolk Island" },
    { value: "112", label: "North Korea" },
    { value: "159", label: "Northern Mariana Islands" },
    { value: "160", label: "Norway" },
    { value: "161", label: "Oman" },
    { value: "162", label: "Pakistan" },
    { value: "163", label: "Palau" },
    { value: "247", label: "Palestinian Territory, Occupied" },
    { value: "164", label: "Panama" },
    { value: "165", label: "Papua New Guinea" },
    { value: "166", label: "Paraguay" },
    { value: "167", label: "Peru" },
    { value: "168", label: "Philippines" },
    { value: "169", label: "Pitcairn" },
    { value: "170", label: "Poland" },
    { value: "171", label: "Portugal" },
    { value: "172", label: "Puerto Rico" },
    { value: "173", label: "Qatar" },
    { value: "174", label: "Reunion" },
    { value: "175", label: "Romania" },
    { value: "176", label: "Russian Federation" },
    { value: "177", label: "Rwanda" },
    { value: "178", label: "Saint Kitts and Nevis" },
    { value: "179", label: "Saint Lucia" },
    { value: "180", label: "Saint Vincent and the Grenadines" },
    { value: "181", label: "Samoa" },
    { value: "182", label: "San Marino" },
    { value: "183", label: "Sao Tome and Principe" },
    { value: "184", label: "Saudi Arabia" },
    { value: "185", label: "Senegal" },
    { value: "243", label: "Serbia" },
    { value: "186", label: "Seychelles" },
    { value: "187", label: "Sierra Leone" },
    { value: "188", label: "Singapore" },
    { value: "189", label: "Slovak Republic" },
    { value: "190", label: "Slovenia" },
    { value: "191", label: "Solomon Islands" },
    { value: "192", label: "Somalia" },
    { value: "193", label: "South Africa" },
    { value: "194", label: "South Georgia & South Sandwich Islands" },
    { value: "248", label: "South Sudan" },
    { value: "195", label: "Spain" },
    { value: "196", label: "Sri Lanka" },
    { value: "249", label: "St. Barthelemy" },
    { value: "197", label: "St. Helena" },
    { value: "250", label: "St. Martin (French part)" },
    { value: "198", label: "St. Pierre and Miquelon" },
    { value: "199", label: "Sudan" },
    { value: "200", label: "Suriname" },
    { value: "201", label: "Svalbard and Jan Mayen Islands" },
    { value: "202", label: "Swaziland" },
    { value: "203", label: "Sweden" },
    { value: "204", label: "Switzerland" },
    { value: "205", label: "Syrian Arab Republic" },
    { value: "206", label: "Taiwan" },
    { value: "207", label: "Tajikistan" },
    { value: "208", label: "Tanzania, United Republic of" },
    { value: "209", label: "Thailand" },
    { value: "210", label: "Togo" },
    { value: "211", label: "Tokelau" },
    { value: "212", label: "Tonga" },
    { value: "213", label: "Trinidad and Tobago" },
    { value: "214", label: "Tunisia" },
    { value: "215", label: "Turkey" },
    { value: "216", label: "Turkmenistan" },
    { value: "217", label: "Turks and Caicos Islands" },
    { value: "218", label: "Tuvalu" },
    { value: "219", label: "Uganda" },
    { value: "220", label: "Ukraine" },
    { value: "221", label: "United Arab Emirates" },
    { value: "222", label: "United Kingdom" },
    { value: "223", label: "United States" },
    { value: "224", label: "United States Minor Outlying Islands" },
    { value: "225", label: "Uruguay" },
    { value: "226", label: "Uzbekistan" },
    { value: "227", label: "Vanuatu" },
    { value: "228", label: "Vatican City State (Holy See)" },
    { value: "229", label: "Venezuela" },
    { value: "230", label: "Viet Nam" },
    { value: "231", label: "Virgin Islands (British)" },
    { value: "232", label: "Virgin Islands (U.S.)" },
    { value: "233", label: "Wallis and Futuna Islands" },
    { value: "234", label: "Western Sahara" },
    { value: "235", label: "Yemen" },
    { value: "238", label: "Zambia" },
    { value: "239", label: "Zimbabwe" },
  ]

}
