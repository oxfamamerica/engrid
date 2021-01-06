import { run } from "../../ts/app";
import getUrlParameter from "../../ts/app/utils/query-string";
import "./sass/main.scss";

const options = {
  	backgroundImage: [
    	"https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10070/05_man_farmer_hoe.jpg?v=1590996842000"
  	],
  	submitLabel: "Donate",
  	donationLevelsOnetime: [1000,500,250,100],
    donationLevelsMonthly: [100,50,35,20]
};




if (document.readyState !== "loading") {
  run(options);
} else {
  document.addEventListener("DOMContentLoaded", function() {
    run(options);
  });
}
