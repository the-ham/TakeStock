import { Controller } from "@hotwired/stimulus";
import { ContextReplacementPlugin } from "webpack";
// import flatpickr from "flatpickr";
// Connects to data-controller="timescroll"
const NEWS_API_KEY = "e261e54b338c4a6a95e2b57a942b9445"
export default class extends Controller {
  static targets = ["time", "value", "news", "tickername"]

  connect() {
    console.log("timescroll connected");
    // flatpickr(this.timeTarget, {
    //   altInput: true
    // })
  };

  select() {
    this.timeTarget.addEventListener("click", e =>{
      let datevalue = this.timeTarget.value
      function getaDate(i) {
        let dateToday = new Date();
        dateToday.setDate(dateToday.getDate() - i);
        let datenumber = dateToday.getDate();
        if (datenumber < 10){
          datenumber = "0" + dateToday.getDate();
        }
        let monthnumber = dateToday.getMonth() + 1;
        if (monthnumber < 10){
          monthnumber = "0" + (dateToday.getMonth() + 1);
        }
        return dateToday.getFullYear() + '-' + monthnumber + '-' + datenumber;
    }
      if(datevalue  === 10){
        this.valueTarget.innerHTML = new Date().toISOString().slice(0, 10);
      } else {
        this.valueTarget.innerHTML = getaDate(( 10 - datevalue));
      }
    });
    let enddate = this.valueTarget.innerHTML
    let ticker = this.tickernameTarget.innerHTML
    console.log(enddate)
    console.log(ticker)
    let url = `https://newsapi.org/v2/everything?q=${ticker}&from=${enddate}&to=${enddate}&sortBy=popularity&apiKey=${NEWS_API_KEY}`
    fetch(url)
      .then(response => response.json())
      .then((data) => {
        replace(data)
      })
  };

  replace(data){
    let array = data["articles"]
    let a = array[0]
    let replacecontent=`<div class="pt-2">
    <div class="flex items-start rounded-xl bg-white p-4 shadow-lg">
      <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
              <img class="w-20 h-20 rounded-xl" src="${a["urlToImage"]}" alt="news">
          </div>
          <div class="flex flex-col h-20 justify-between">
            <div>
              <a href="${a["url"]}" target="_blank">
                <p class="text-sm font-medium text-gray-900 dark:text-white"
                style="display: -webkit-box; -webkit-box-orient: vertical;
                -webkit-line-clamp: 3; overflow: hidden;">
                  ${a["title"]}
                </p>
              </a>
            </div>
            <div>
              <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                ${a["publishedAt"]}
              </p>
            </div>
          </div>
      </div>
    </div>
  </div>
  <p data-timescroll-target="tickername" class="hidden"><%= @stock.ticker %></p>
  `
  this.newsTarget.innerHTML = replacecontent
  }
}
