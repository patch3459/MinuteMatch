/*

  Chris (or Sean). If you are reading this and Patrick is moving the website to a server please remind him to 
  change the certificates for that domain (inverbatim).

  If Patrick is truly unavailable for some reason use this guide

  https://itnext.io/node-express-letsencrypt-generate-a-free-ssl-certificate-and-run-an-https-server-in-5-minutes-a730fbe528ca

  Cheers
  Patrick

*/
//mandatory imports
const express = require('express');
const path = require('path');
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');
const multer = require('multer');
const fetch = require("node-fetch");
const https = require("https");
const fs = require('fs');
const favicon = require("serve-favicon");
const cookieParser = require("cookie-parser")
// developmental imports 
const moment = require('moment-timezone'); // date time formatting for logger via moment JS

const upload = multer();
const app = express();
const logger = (req, res, next) => {
  console.log(`${req.protocol}://${req.get('host')}${req.originalUrl} at ${moment().tz("America/New_York").format('LLL')} US/New York (GMT-4)`);
  next();
  //basically logging every request made (rn it's just a dev tool)
};

app.use(logger);
app.use(express.urlencoded({ extended: false }));
app.use(favicon(path.join(__dirname, 'public', 'favicon', 'MM.png')));
//app.use(express.static(path.join(__dirname, '/public/static'))); // basically for static pages it'll return the exact page
app.use('/public',express.static('public'));
app.use('/styles', express.static(path.join(__dirname, 'public', 'styles')));
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));

app.use(upload.array()); // for forms
app.use(bodyParser.urlencoded({ extended: true })); //even more body parsing
app.use(express.json());
app.use(cookieParser())
app.set('query parser', function(str) {
  return qs.parse(str, { depth: 50 });
});
//handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main', helpers: require(path.join(__dirname, 'public', 'config')) }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'public', 'views'));





app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "static", "index.html"));
});


app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "static", "contact.html"));
});
app.get("/quiz", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "static", "newquiz.html"));
});	// to do: perhaps redirect to a render in with the form data

app.get("/collegeMatches", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "static", "matches.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "static", "about.html"))
});

/*

//developmental endpoint only for college.html
app.get("/c", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "static", "college.html"))
});



app.get("/colleges/:college", (req, res) => {

  let body = new URLSearchParams({
    "api_key": "wAAbfqWZplVi4uvDdB7gdbFU",
    "college_ids": req.params.college.replace(/[A-Z]/g, letter => letter.toLowerCase() ).replace(/ /g, "-"),
    //"college_ids": req.body.college.replace(/ /g,"-"),
    "info_ids": "acceptance_rate,act_cumulative_midpoint,act_cumulative_percentile25,act_cumulative_percentile75,admissions_website,aliases,application_website,average_aid_awarded_high_income,average_aid_awarded_lower_middle_income,average_aid_awarded_low_income,average_aid_awarded_middle_income,average_aid_awarded_upper_middle_income,average_financial_aid,avg_cost_of_attendance,avg_net_price,calendar_system,campus_image,city,class_size_range10_to19,class_size_range20_to29,class_size_range2_to9,class_size_range30_to39,class_size_range40_to49,class_size_range50_to99,class_size_range_over100,demographics_men,demographics_women,financial_aid_website,four_year_graduation_rate,fraternities_percent_participation,freshmen_live_on_campus,in_state_tuition,is_private,meal_plan_available,median_earnings_six_yrs_after_entry,median_earnings_ten_yrs_after_entry,men_varsity_sports,net_price_by_income_level0_to3000,net_price_by_income_level110001_plus,net_price_by_income_level30001_to48000,net_price_by_income_level48001_to75000,net_price_by_income_level75001_to110000,offers_study_abroad,on_campus_housing_available,out_of_state_tuition,percent_of_students_who_receive_financial_aid,percent_students_receiving_federal_grant_aid,percent_undergrads_awarded_aid,rankings_best_college_academics,rankings_best_college_athletics,rankings_best_college_campuses,rankings_best_college_food,rankings_best_college_locations,rankings_best_college_professors,rankings_best_colleges,rankings_best_colleges_for_art,rankings_best_colleges_for_biology,rankings_best_colleges_for_business,rankings_best_colleges_for_chemistry,rankings_best_colleges_for_communications,rankings_best_colleges_for_computer_science,rankings_best_colleges_for_design,rankings_best_colleges_for_economics,rankings_best_colleges_for_engineering,rankings_best_colleges_for_history,rankings_best_colleges_for_nursing,rankings_best_colleges_for_physics,rankings_best_greek_life_colleges,rankings_best_student_athletes,rankings_best_student_life,rankings_best_test_optional_colleges,rankings_best_value_colleges,rankings_colleges_that_accept_the_common_app,rankings_colleges_with_no_application_fee,rankings_hardest_to_get_in,rankings_hottest_guys,rankings_most_conservative_colleges,rankings_most_liberal_colleges,rankings_most_diverse_colleges,rankings_top_party_schools,region,sat_average,sat_composite_midpoint,sat_composite_percentile25,sat_composite_percentile75,sat_math_midpoint,sat_math_percentile25,sat_math_percentile75,sat_reading_midpoint,sat_reading_percentile25,sat_reading_percentile75,student_faculty_ratio,students_submitting_a_c_t,students_submitting_s_a_t,type_year,typical10_year_earnings,typical6_year_earnings,typical_books_and_supplies,typical_financial_aid,typical_misc_expenses,typical_room_and_board,undergrad_application_fee,undergraduate_size,women_only,women_varsity_sports"
  });

  let url = urll = "https://api.collegeai.com/v1/api/college/info?" + body.toString();

  fetch(urll)
    .then(r => r.json())
    .then(response => {
      let properties = response["colleges"][0];
    
      let tofix = ["rankingsBestCollegeAcademics",
        "rankingsBestCollegeAthletics",
        "rankingsBestCollegeCampuses",
        "rankingsBestCollegeFood",
        "rankingsBestCollegeLocations",
        "rankingsBestCollegeProfessors",
        "rankingsBestColleges",
        "rankingsBestCollegesForBiology",
        "rankingsBestCollegesForChemistry",
        "rankingsBestCollegesForCommunications",
        "rankingsBestCollegesForComputerScience",
        "rankingsBestCollegesForEconomics",
        "rankingsBestCollegesForEngineering",
        "rankingsBestCollegesForHistory",
        "rankingsBestCollegesForPhysics",
        "rankingsBestGreekLifeColleges",
        "rankingsBestStudentAthletes",
        "rankingsBestStudentLife",
        "rankingsBestValueColleges",
        "rankingsCollegesThatAcceptTheCommonApp",
        "rankingsHardestToGetIn",
        "rankingsHottestGuys",
        "rankingsMostConservativeColleges",
        "rankingsMostLiberalColleges",
        "rankingsMostDiverseColleges",
        "rankingsTopPartySchools"];

       for (var i = 0; i < tofix.length; i++) {
            try{ 
            properties[tofix[i]] = 100 - Math.floor(100 * response["colleges"][0][tofix[i]]["value"] / response["colleges"][0][tofix[i]]["total"]);
            }
            catch(error){continue;}
          }
      
      
      // to do rn; you have the custom request....now try to start rendering in stuff 8-31-2021

      console.log(properties)

      res.render('college', {
        "name": properties["name"],
        "city": properties["city"],
        "img": properties["campusImage"],
        "avgNetPrice": properties["avgNetPrice"],
        "avgCostOfAttendance": properties["avgCostOfAttendance"],
        "acceptanceRate":  properties["acceptanceRate"] ?  Math.floor(100 * properties["acceptanceRate"]) : 100,
        "satAverage": properties["satAverage"],
        "yourSat": req.cookies["student_response"] ? JSON.parse(req.cookies["student_response"])["satOverall"]: 0,
        "actCumulativeMidpoint": properties["actCumulativeMidpoint"],
        "yourAct": req.cookies["student_response"] ? JSON.parse(req.cookies["student_response"])["act-composite"]: 0,
        "artPercentile": properties["rankingsBestCollegesForArt"]? 1 - properties["rankingsBestCollegesForArt"]["value"] / properties["rankingsBestCollegesForArt"]["total"]: 0, 
        "bioPercentile":properties["rankingsBestCollegesForBiology"]? 1 - properties["rankingsBestCollegesForBiology"]["value"] / properties["rankingsBestCollegesForBiology"]["total"]: 0, 
        "businessPercentile": properties["rankingsBestCollegesForBusiness"]? 1 - properties["rankingsBestCollegesForBusiness"]["value"] / properties["rankingsBestCollegesForBusiness"]["total"]: 0, 
        "chemistryPercentile": properties["rankingsBestCollegesForChemistry"]? 1 - properties["rankingsBestCollegesForChemistry"]["value"] / properties["rankingsBestCollegesForChemistry"]["total"]: 0,
        "communicationsPercentile": properties["rankingsBestCollegesForCommunications"]? 1 - properties["rankingsBestCollegesForCommunications"]["value"] / properties["rankingsBestCollegesForCommunications"]["total"]: 0,
        "csPercentile": properties["rankingsBestCollegesForComputerScience"]? 1 - properties["rankingsBestCollegesForComputerScience"]["value"] / properties["rankingsBestCollegesForComputerScience"]["total"]: 0,
        "economicsPercentile": properties["rankingsBestCollegesForEconomics"]? 1 - properties["rankingsBestCollegesForEconomics"]["value"] / properties["rankingsBestCollegesForEconomics"]["total"]: 0,
         "historyPercentile": properties["rankingsBestCollegesForHistory"]? 1 - properties["rankingsBestCollegesForHistory"]["value"] / properties["rankingsBestCollegesForHistory"]["total"]: 0,
         "nursingPercentile": properties["rankingsBestCollegesForNursing"]? 1 - properties["rankingsBestCollegesForNursing"]["value"] / properties["rankingsBestCollegesForNursing"]["total"]: 0,
         "physicsPercentile": properties["rankingsBestCollegesForPhysics"]? 1 - properties["rankingsBestCollegesForPhysics"]["value"] / properties["rankingsBestCollegesForPhysics"]["total"]: 0,
        "greekPercentile": properties["rankingsBestGreekLifeColleges"]? 1 - 1 - properties["rankingsBestGreekLifeColleges"]["value"] / properties["rankingsBestGreekLifeColleges"]["total"]: 0
      });
    });




}); */

/*
app.get("/ct", (req, res) =>{
  res.sendFile(path.join(__dirname, "public", "static", "college.html") )
}); 


app.get("/matches", (req, res) => {

  try {
    let url = new URLSearchParams({
      "api_key": "wAAbfqWZplVi4uvDdB7gdbFU",
      "filters": JSON.stringify(JSON.parse(req.cookies["student_response"])),
      "info_ids": "website"
    });


    url = "https://api.collegeai.com/v1/api/college-list?" + url.toString();

    var matches = [];
    //console.log(url);

    fetch(url)
      .then(r => r.json())
      .then(response => {
        const r = response;
        let i = 0;
        console.log(r["colleges"] + "\n\n\n\n\n\n")
        for (let d of r["colleges"]) {
          matches[i] = {raw: d, name: d["collegeId"].replace(/-/g, " ").replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())};
          // ^ I know this looks like a fucking nightmare 
          //it's just a regular expression so don't panic
          i++;
        }
        console.log(otherMatches)
        res.render('matches', {
          top: matches[0]["name"],
          topRAW: matches[0]["raw"],
          secondRAW: matches[1]["raw"],
          second: matches[1]["name"],
          third: matches[2]["name"],
          thirdRAW: matches[2]["raw"],
          otherMatches: matches.slice(3)
        });
      });
  }

  catch (error) {
    res.redirect("/quiz");
  }

});

 */

app.post("/process", (req, res) => {

  let fixed_stats = {};
  let stats = {
    "funding-type": [req.body.publictype],
    "schoolSize": [req.body.schoolSize],
    "zipCode": req.body.zip,
    "distanceFromHomeMiles": [0, parseInt(req.body.distance)],
    "satOverall": req.body.SAT,
    "act-composite": req.body.ACT,
    "gpa-minimum-ten-percent": parseFloat(req.body.gpa),
    "degree-length": req.body.type,
    "school-size": req.body.schoolSize,
    "show-safeties": req.body.showsafeties,
    "show-reaches": req.body.showreaches,
    "in-state": req.body.state,
    "closeToMyScores": true
  };


  // removing the unanswered questions
  for (let key in stats) {
    if (key === "zip") {
      if (!(stats["zip"] === "00000" || parseInt(stats["zip"]) < 0)) {
        fixed_stats["zip"] = stats["zip"];
      }
    }
    else if (Array.isArray(stats[key])) {
      if (!stats[key][0] === "") {
        fixed_stats[key] = stats[key];
      }
    }
    else if (!(stats[key] === "")) {
      fixed_stats[key] = stats[key];
    }
  }

  delete stats;

  // calling the API

  let url = new URLSearchParams({
    "api_key": "wAAbfqWZplVi4uvDdB7gdbFU",
    "filters": JSON.stringify(fixed_stats),
    "info_ids": "website"
  });


  url = "https://api.collegeai.com/v1/api/college-list?" + url.toString();

  var matches = [];

  //console.log(url);

  fetch(url)
    .then(r => r.json())
    .then(response => {
      const r = response;
      let i = 0;
      for (let d of r["colleges"]) {
        console.log(d)
          matches[i] = {raw: d["collegeId"], name: d["name"]};

        // ^ I know this looks like a fucking nightmare 
        //it's just a regular expression so don't panic
        i++;
      }

      // setting cookie

      res.cookie('student_response', JSON.stringify(fixed_stats));
      // rendering in page

         res.render('matches', {
          top: matches[0]["name"],
          topRAW: matches[0]["raw"],
          secondRAW: matches[1]["raw"],
          second: matches[1]["name"],
          third: matches[2]["name"],
          thirdRAW: matches[2]["raw"],
          otherMatches: matches.slice(3)
      });
    })

});

// 404 page
app.use((req, res) => {
  res.status(404);
  res.sendFile(path.join(__dirname, "public", "static", "404.html"));
});

//error page
/*
app.use((err, req, res, next) =>{

});
*/


/* const server = https.createServer(
  {
  key: fs.readFileSync(path.join(__dirname, 'public', 'cert', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'public','cert', 'cert.pem')),
  ca: fs.readFileSync(path.join(__dirname, 'public','cert', 'cert.pem'))
  },
  app
); 
*/


// btw Chris if you're wondering how to load the server go type in "localhost:" and then whatever the port is
const PORT = process.env.PORT || 443; // basically if we deploy this irl it'll use whatever port it fancies (or 5000 if locally)

app.listen(PORT, () => console.log(`Server up! @ localhost:${PORT}`));
//server.listen(PORT, () => console.log(`Server up! @ localhost:${PORT}`)); // self-reminder use a tilda on templates lmao
