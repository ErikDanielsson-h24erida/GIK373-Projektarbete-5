//  Öppnar och stänger hamburgarmenyn
function setupMenuToggle() {
  const toggleButton = document.querySelector(".hamburger");
  const menu = document.querySelector(".mobile-menu");

  if (!toggleButton || !menu) return;

  toggleButton.addEventListener("click", () => {
    menu.classList.toggle("mobile-menu--active");
  });

  menu.addEventListener("click", (event) => {
    if (event.target.classList.contains("mobile-menu-link")) {
      menu.classList.remove("mobile-menu--active");
    }
  });

  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && !toggleButton.contains(event.target)) {
      menu.classList.remove("mobile-menu--active");
    }
  });
}
setupMenuToggle();

//  Öppnar och stänger infokort (på mobil)
function setupInfoAccordion() {
  const accordionItems = document.querySelectorAll(".info-accordion-item");

  accordionItems.forEach((item) => {
    const button = item.querySelector(".info-accordion-button");

    button.addEventListener("click", () => {
      if (window.innerWidth >= 1440) return;
      item.classList.toggle("is-open");
    });
  });
}
setupInfoAccordion();

//  Byter mellan Götaland, Svealand och Norrland
const regionTabs = document.querySelectorAll(".region-browser-tab");
const regionPanels = document.querySelectorAll(".region-browser-panel");
regionTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const selectedRegion = tab.dataset.region;

    regionTabs.forEach((button) => {
      button.classList.remove("is-active");
    });

    regionPanels.forEach((panel) => {
      panel.classList.remove("is-active");
    });

    tab.classList.add("is-active");
    document.getElementById(selectedRegion).classList.add("is-active");
  });
});

//  Öppnar och stänger länskort
const regionAccordionItems = document.querySelectorAll(".accordion-item");
regionAccordionItems.forEach((item) => {

  const button = item.querySelector(".accordion-button");
  button.addEventListener("click", () => {
    
    const isAlreadyOpen = item.classList.contains("is-open");
    regionAccordionItems.forEach((accordionItem) => {
      accordionItem.classList.remove("is-open");
    });
    if (!isAlreadyOpen) {
      item.classList.add("is-open");
    }
  });
});

//  koppar sök till rätt input
const län = {
  "skåne": {regionId: "götaland", länNamn: "Skåne län"},
  "blekinge": {regionId: "götaland", länNamn: "Blekinge län"},
  "kalmar": { regionId: "götaland", länNamn: "Kalmar län"},
  "västra götaland": {regionId: "götaland", länNamn: "Västra Götalands län"},
  "gotland": {regionId: "götaland", länNamn: "Gotlands län"},
  "halland": {regionId: "götaland", länNamn: "Hallands län"},
  "kronoberg": {regionId: "götaland", länNamn: "Kronobergs län"},
  "jönköping": {regionId: "götaland", länNamn: "Jönköpings län"},
  "östergötland": {regionId: "götaland", länNamn: "Östergötlands län"},
  "stockholm": {regionId: "svealand", länNamn: "Stockholms län"},
  "uppsala": {regionId: "svealand", länNamn: "Uppsala län"},
  "södermanland": {regionId: "svealand", länNamn: "Södermanlands län"},
  "värmland": {regionId: "svealand", länNamn: "Värmlands län"},
  "örebro": {regionId: "svealand", länNamn: "Örebro län"},
  "västmanland": {regionId: "svealand", länNamn: "Västmanlands län"},
  "dalarna": {regionId: "svealand", länNamn: "Dalarnas län"},
  "gävleborg": {regionId: "norrland", länNamn: "Gävleborgs län"},
  "västernorrland": {regionId: "norrland", länNamn: "Västernorrlands län"},
  "jämtland": {regionId: "norrland", länNamn: "Jämtlands län"},
  "västerbotten": {regionId: "norrland", länNamn: "Västerbottens län"},
  "norrbotten": {regionId: "norrland", länNamn: "Norrbottens län"}
};

//  Söker efter Län och öppnar
const regionSearch = document.querySelector("#regionSearch");
const regionInput = document.querySelector("#regionInput");
regionSearch.addEventListener("submit", (event) => {
  event.preventDefault();

  const searchValue = regionInput.value.trim().toLowerCase();
  const match = län[searchValue];

  if (!match) {
    alert("Hittade inget län med det namnet.");
    return;
  }

  const selectedTab = document.querySelector(`.region-browser-tab[data-region="${match.regionId}"]`);
  const selectedPanel = document.getElementById(match.regionId);

  regionTabs.forEach((tab) => {
    tab.classList.remove("is-active");
  });

  regionPanels.forEach((panel) => {
    panel.classList.remove("is-active");
  });

  selectedTab.classList.add("is-active");
  selectedPanel.classList.add("is-active");

  regionAccordionItems.forEach((item) => {
    item.classList.remove("is-open");
  });

  const regionButtons = selectedPanel.querySelectorAll(
    ".accordion-button span"
  );

  regionButtons.forEach((regionButton) => {
    if (regionButton.textContent.trim() === match.länNamn) {
      const accordionItem = regionButton.closest(".accordion-item");
      accordionItem.classList.add("is-open");
      accordionItem.scrollIntoView({behavior: "smooth", block: "center"});
    }
  });
});

//  Pil som skickar en upp till start
function setupBackToTopButton() {
  const backToTopButton = document.querySelector(".back-to-top");

  if (!backToTopButton) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) 
    {
      backToTopButton.classList.add("is-visible");
    } else 
    {
      backToTopButton.classList.remove("is-visible");
    }
  });
}
setupBackToTopButton();


//Lagring av Länsdata
const regionData = {};

//      Datainhämtningar


// Befolkning per län från SCB
const urlBefolkning ="https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BE/BE0101/BE0101A/BefolkManad";

const queryBefolkning = {
  query: [
    {
      code: "Region",
      selection: {
        filter: "vs:RegionLän07",
        values: [
          "01", "03", "04", "05", "06", "07", "08",
          "09", "10", "12", "13", "14", "17", "18",
          "19", "20", "21", "22", "23", "24", "25"
        ]
      }
    },
    {
      code: "Tid",
      selection: {
        filter: "item",
        values: ["2024M12"]
      }
    }
  ],
  response: {
    format: "JSON"
  }
};

const requestBefolkning = new Request(urlBefolkning, {
  method: "POST",
  body: JSON.stringify(queryBefolkning)
});


// Jordbruksareal åkermark per län från Jordbruksverket
const urlArea ="https://statistik.sjv.se/PXWeb/api/v1/sv/Jordbruksverkets%20statistikdatabas/Arealer/1%20Riket%20l%C3%A4n%20kommun/JO0104B1.px";

const queryArea = {
  query: [
    {
      code: "Län",
      selection: {
        filter: "item",
        values: [
          "1", "2", "3", "4", "5", "6", "7",
          "8", "9", "11", "13", "14", "18",
          "19", "20", "21", "22", "23", "24",
          "25", "26"
        ]
      }
    },
    {
      code: "Gröda",
      selection: {
        filter: "item",
        values: ["0"]
      }
    },
    {
      code: "Variabel",
      selection: {
        filter: "item",
        values: ["0"]
      }
    },
    {
      code: "År",
      selection: {
        filter: "item",
        values: ["43"]
      }
    }
  ],
  response: {
    format: "JSON"
  }
};

const requestArea = new Request(urlArea, {
  method: "POST",
  body: JSON.stringify(queryArea)
});

// Skörd per län från Jordbruksverket
const urlSkord ="https://statistik.sjv.se/PXWeb/api/v1/sv/Jordbruksverkets%20statistikdatabas/Skordar/JO0601J01.px";

const querySkord = {
  query: [
    {
      code: "Län",
      selection: {
        filter: "item",
        values: [
          "1", "2", "3", "4", "5", "6", "7",
          "8", "9", "11", "13", "14", "18",
          "19", "20", "21", "22", "23", "24",
          "25", "26"
        ]
      }
    },
    {
      code: "Gröda",
      selection: {
        filter: "item",
        values: ["11"]
      }
    },
    {
      code: "Variabel",
      selection: {
        filter: "item",
        values: ["3"]
      }
    },
    {
      code: "Tabelluppgift",
      selection: {
        filter: "item",
        values: ["0"]
      }
    },
    {
      code: "År",
      selection: {
        filter: "item",
        values: ["59"]
      }
    }
  ],
  response: {
    format: "JSON"
  }
};

const requestSkord = new Request(urlSkord, {
  method: "POST",
  body: JSON.stringify(querySkord)
});

// Slakt av djur i tusen ton per län från Jordbruksverket
const urlSlakt ="https://statistik.sjv.se/PXWeb/api/v1/sv/Jordbruksverkets%20statistikdatabas/Animalieproduktion/Slakt/JO0604B1.px";

const querySlakt = {
  query: [
    {
      code: "Län",
      selection: {
        filter: "item",
        values: [
          "1", "2", "3", "4", "5", "6", "7",
          "8", "9", "10", "11", "12", "13",
          "14", "15", "16", "17", "18", "19",
          "20", "21"
        ]
      }
    },
    {
      code: "Djurslag",
      selection: {
        filter: "item",
        values: ["12", "18", "22"]
      }
    },
    {
      code: "Variabel",
      selection: {
        filter: "item",
        values: ["1"]
      }
    },
    {
      code: "År",
      selection: {
        filter: "item",
        values: ["8"]
      }
    }
  ],
  response: {
    format: "JSON"
  }
};

const requestSlakt = new Request(urlSlakt, {
  method: "POST",
  body: JSON.stringify(querySlakt)
});


//      Hjälpfunktioner

// Gör om värden från hämtad data till säkra nummer.
function toNumber(value) {
  const number = Number(String(value).replace(/\s/g, "").replace(",", "."));
  return isNaN(number) ? 0 : number;
}

// Skapar länet i regionData om det inte finns och lägger sedan till rätt värde.
function addRegionValue(regionName, key, value) {
  if (!regionData[regionName]) {
    regionData[regionName] = {
      name: regionName,
      population: 0,
      area: 0,
      harvest: 0,
      slaughter: 0
    };
  }

  regionData[regionName][key] += toNumber(value);
}

// Konverterar länsnamn så att de matchar namnen i geojson-filen.
function regionNameForMap(regionName) {
  const names = {
    "Stockholms län": "Stockholm",
    "Uppsala län": "Uppsala",
    "Södermanlands län": "Södermanland",
    "Östergötlands län": "Östergötland",
    "Jönköpings län": "Jönköping",
    "Kronobergs län": "Kronoberg",
    "Kalmar län": "Kalmar",
    "Gotlands län": "Gotland",
    "Blekinge län": "Blekinge",
    "Skåne län": "Skåne",
    "Hallands län": "Halland",
    "Västra Götalands län": "Västra Götaland",
    "Värmlands län": "Värmland",
    "Örebro län": "Örebro",
    "Västmanlands län": "Västmanland",
    "Dalarnas län": "Dalarna",
    "Gävleborgs län": "Gävleborg",
    "Västernorrlands län": "Västernorrland",
    "Jämtlands län": "Jämtland",
    "Västerbottens län": "Västerbotten",
    "Norrbottens län": "Norrbotten"
  };
  return names[regionName];
}


//      Omvandlar hämtad data till regionData

// Lägger in befolkning per län i regionData.
function printBefolkningChart(befolkningData) {
  const regionNames = {
    "01": "Stockholms län",
    "03": "Uppsala län",
    "04": "Södermanlands län",
    "05": "Östergötlands län",
    "06": "Jönköpings län",
    "07": "Kronobergs län",
    "08": "Kalmar län",
    "09": "Gotlands län",
    "10": "Blekinge län",
    "12": "Skåne län",
    "13": "Hallands län",
    "14": "Västra Götalands län",
    "17": "Värmlands län",
    "18": "Örebro län",
    "19": "Västmanlands län",
    "20": "Dalarnas län",
    "21": "Gävleborgs län",
    "22": "Västernorrlands län",
    "23": "Jämtlands län",
    "24": "Västerbottens län",
    "25": "Norrbottens län"
  };

  befolkningData.data.forEach((item) => {
    const regionName = regionNames[item.key[0]];
    const value = item.values[0];

    addRegionValue(regionName, "population", value);
  });
}

// Lägger in åkermark per län i regionData.
function printAreaChart(areaData) {
  const regionNames = {
    "1": "Stockholms län",
    "2": "Uppsala län",
    "3": "Södermanlands län",
    "4": "Östergötlands län",
    "5": "Jönköpings län",
    "6": "Kronobergs län",
    "7": "Kalmar län",
    "8": "Gotlands län",
    "9": "Blekinge län",
    "11": "Skåne län",
    "13": "Hallands län",
    "14": "Västra Götalands län",
    "18": "Värmlands län",
    "19": "Örebro län",
    "20": "Västmanlands län",
    "21": "Dalarnas län",
    "22": "Gävleborgs län",
    "23": "Västernorrlands län",
    "24": "Jämtlands län",
    "25": "Västerbottens län",
    "26": "Norrbottens län"
  };

  areaData.data.forEach((item) => {
    const regionName = regionNames[item.key[0]];
    const value = item.values[0];

    addRegionValue(regionName, "area", value);
  });
}

// Lägger in skörd per län i regionData.
function printSkordChart(skordData) {
  const regionNames = {
    "1": "Stockholms län",
    "2": "Uppsala län",
    "3": "Södermanlands län",
    "4": "Östergötlands län",
    "5": "Jönköpings län",
    "6": "Kronobergs län",
    "7": "Kalmar län",
    "8": "Gotlands län",
    "9": "Blekinge län",
    "11": "Skåne län",
    "13": "Hallands län",
    "14": "Västra Götalands län",
    "18": "Värmlands län",
    "19": "Örebro län",
    "20": "Västmanlands län",
    "21": "Dalarnas län",
    "22": "Gävleborgs län",
    "23": "Västernorrlands län",
    "24": "Jämtlands län",
    "25": "Västerbottens län",
    "26": "Norrbottens län"
  };

  skordData.data.forEach((item) => {
    const regionName = regionNames[item.key[0]];
    const value = item.values[0];

    addRegionValue(regionName, "harvest", value);
  });
}

// Lägger in slakt per län i regionData.
function printSlaktChart(slaktData) {
  const regionNames = {
    "1": "Stockholms län",
    "2": "Uppsala län",
    "3": "Södermanlands län",
    "4": "Östergötlands län",
    "5": "Jönköpings län",
    "6": "Kronobergs län",
    "7": "Kalmar län",
    "8": "Gotlands län",
    "9": "Blekinge län",
    "10": "Skåne län",
    "11": "Hallands län",
    "12": "Västra Götalands län",
    "13": "Värmlands län",
    "14": "Örebro län",
    "15": "Västmanlands län",
    "16": "Dalarnas län",
    "17": "Gävleborgs län",
    "18": "Västernorrlands län",
    "19": "Jämtlands län",
    "20": "Västerbottens län",
    "21": "Norrbottens län"
  };

  const regionCodes = Object.keys(regionNames);

  const values = regionCodes.map((regionCode) => {
    const rowsForRegion = slaktData.data.filter((item) => {
      return item.key[0] === regionCode;
    });

    return rowsForRegion.reduce((sum, item) => {
      const value = toNumber(item.values[0]);
      return sum + value;
    }, 0);
  });

  regionCodes.forEach((regionCode, index) => {
    const regionName = regionNames[regionCode];
    const value = values[index];

    addRegionValue(regionName, "slaughter", value);
  });
}


//      Beräkningar

const needPerPerson = {
  harvest: 0.5,
  area: 0.41,
  slaughter: 0.08
};
// Räknar ut resiliensindex och procentvärden för varje län.
function calculateResilience() {
  const regionArray = Object.values(regionData);

  regionArray.forEach((region) => {
    const population = toNumber(region.population);
    const harvest = toNumber(region.harvest);
    const area = toNumber(region.area);
    const slaughter = toNumber(region.slaughter);

    if (!population || !harvest || !area || !slaughter) {
      console.warn("Saknar data:", region.name);
      return;
    }

    region.harvestPerPerson = harvest / population;
    region.areaPerPerson = area / population;
    region.slaughterPerPerson = (slaughter * 1000) / population;

    region.cropCoverage = region.harvestPerPerson / needPerPerson.harvest;
    region.areaCoverage = region.areaPerPerson / needPerPerson.area;
    region.animalCoverage = region.slaughterPerPerson / needPerPerson.slaughter;

    region.cropPercent = Math.round(region.cropCoverage * 100);
    region.areaPercent = Math.round(region.areaCoverage * 100);
    region.animalPercent = Math.round(region.animalCoverage * 100);

    region.cropIndex = Math.min(region.cropCoverage, 1);
    region.areaIndex = Math.min(region.areaCoverage, 1);
    region.animalIndex = Math.min(region.animalCoverage, 1);

    region.resiliensIndex =
      (region.cropIndex + region.areaIndex + region.animalIndex) / 3;

    region.totalScore = Math.round(region.resiliensIndex * 100);

    region.totalPercent = Math.round(
      region.cropPercent + region.areaPercent + region.animalPercent
    );
  });

  renderRegionDoughnut();
  renderRegionBars();
  renderStatsCarousel();
}


//      Renderar staplar, cirkel och kartdiagram

// Fyller stapeldiagrammen för varje län.
function renderRegionBars() {
  const regionArray = Object.values(regionData);

  regionArray.forEach((region) => {
    const metricsBox = document.querySelector(
      `.region-metrics[data-region-metrics="${region.name}"]`
    );

    if (!metricsBox) {
      return;
    }

    const metrics = {
      area: region.areaPercent,
      crop: region.cropPercent,
      animal: region.animalPercent
    };

    Object.keys(metrics).forEach((key) => {
      const value = Math.round(metrics[key]);

      const valueElement = metricsBox.querySelector(
        `[data-metric-value="${key}"]`
      );

      const baseFillElement = metricsBox.querySelector(
        `[data-metric-fill-base="${key}"]`
      );

      const overflowFillElement = metricsBox.querySelector(
        `[data-metric-fill-overflow="${key}"]`
      );

      if (valueElement) {
        valueElement.textContent = `${value}%`;
      }

      const cappedValue = Math.min(value, 200);

      const baseWidth = (Math.min(cappedValue, 100) / 100) * 50;
      const overflowWidth = (Math.max(cappedValue - 100, 0) / 100) * 50;

      if (baseFillElement) {
        baseFillElement.style.width = `${baseWidth}%`;
      }

      if (overflowFillElement) {
        overflowFillElement.style.width = `${overflowWidth}%`;
      }
    });
  });
}

// Skapar cirkeldiagrammen för varje län.
const regionDoughnutInstances = {};
function renderRegionDoughnut() {
  const regionArray = Object.values(regionData);

  regionArray.forEach((region) => {
    const canvas = document.querySelector(
      `.region-doughnut[data-region="${region.name}"]`
    );

    if (!canvas) {
      return;
    }

    const score = Number(region.totalScore);

    const scoreElement = document.querySelector(
      `.accordion-score[data-score-region="${region.name}"]`
    );

    if (scoreElement) {
      scoreElement.textContent = `Resiliensindex: ${score}%`;
    }

    if (regionDoughnutInstances[region.name]) {
      regionDoughnutInstances[region.name].destroy();
    }

    regionDoughnutInstances[region.name] = new Chart(canvas, {
      type: "doughnut",
      data: {
        labels: ["Poäng", "Kvar"],
        datasets: [
          {
            data: [score, 100 - score],
            backgroundColor: ["#10b981", "#ef4444"],
            borderColor: ["#cccccc"],
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        }
      }
    });
  });
}

// Ritar kartan med länens resiliensindex.
function calculateAndDrawMap(geojson) {
  const regionArray = Object.values(regionData);

  regionArray.forEach((region) => {
    if (!region.totalScore) {
      region.mapScore = 0;
      return;
    }

    region.mapScore = region.totalScore;
  });

  const mapCounties = regionArray.map((region) => {
    return regionNameForMap(region.name);
  });

  const mapScores = regionArray.map((region) => {
    return region.mapScore;
  });

  const trafficLightScale = [
    [0.0, "#ef4444"],
    [0.25, "#f97316"],
    [0.5, "#eab308"],
    [0.75, "#84cc16"],
    [1.0, "#10b981"]
  ];

  Plotly.newPlot(
    "resilienceMap",
    [
      {
        type: "choroplethmap",
        geojson: geojson,
        locations: mapCounties,
        z: mapScores,
        featureidkey: "properties.name",
        colorscale: trafficLightScale,
        zmin: 0,
        zmax: 100,
        showscale: false,
        marker: {
          line: {
            width: 1.2,
            color: "#111827"
          }
        },
        hoverinfo: "text",
        text: regionArray.map((region) => {
          return `${region.name}<br>Resiliensindex: ${region.mapScore}%`;
        })
      }
    ],
    {
      autosize: true,
      map: {
        style: "dark",
        center: {
          lon: 16.5,
          lat: 62.9
        },
        zoom: window.innerWidth < 1440 ? 3.6 : 3.8
      },
      paper_bgcolor: "rgba(0,0,0,0)",
      margin: {
        t: 0,
        b: 0,
        l: 0,
        r: 0
      }
    },
    {
      responsive: true,
      displayModeBar: false,
      scrollZoom: false,
      doubleClick: false,
      dragMode: false
    }
  );
}


//      Statistik-karusell
let currentStatsSlide = 0;
// Byter aktiv slide i statistikkarusellen.
function showStatsSlide(index) {
  const slides = document.querySelectorAll(".stats-carousel-slide");
  const dots = document.querySelectorAll(".stats-carousel-dot");

  if (!slides.length) return;

  currentStatsSlide = (index + slides.length) % slides.length;

  slides.forEach((slide) => {
    slide.classList.remove("is-active");
  });

  dots.forEach((dot) => {
    dot.classList.remove("is-active");
  });

  slides[currentStatsSlide].classList.add("is-active");

  if (dots[currentStatsSlide]) {
    dots[currentStatsSlide].classList.add("is-active");
  }
}

// Lägger in rätt värden i progressbarens HTML-struktur
function createCarouselProgressBar(label, value, modifierClass = "") {
  const roundedValue = Math.round(value);
  const safeValue = Math.min(roundedValue, 100);

  return `
    <div class="carousel-metric">
      <div class="carousel-metric-top">
        <span>${label}</span>
        <span>${roundedValue}%</span>
      </div>
      <div class="carousel-metric-bar">
        <div 
          class="carousel-metric-fill ${modifierClass}" 
          style="width: ${safeValue}%">
        </div>
      </div>
    </div>
  `;
}

// Renderar innehållet i karusellen baserat på regionData
function renderStatsCarousel() {
  const regionArray = Object.values(regionData).filter((region) => {
    return region.totalScore !== undefined;
  });

  if (!regionArray.length) return;

  const topCounties = [...regionArray]
    .sort((a, b) => {
      return b.totalScore - a.totalScore;
    })
    .slice(0, 3);

  const topCountiesBars = document.querySelector("#topCountiesBars");

  if (topCountiesBars) {
    topCountiesBars.innerHTML = topCounties
      .map((region) => {
        return createCarouselProgressBar(region.name, region.totalScore);
      })
      .join("");
  }

  const lowestCounties = [...regionArray]
    .sort((a, b) => {
      return a.totalScore - b.totalScore;
    })
    .slice(0, 3);

  const lowestCountiesBars = document.querySelector("#lowestCountiesBars");

  if (lowestCountiesBars) {
    lowestCountiesBars.innerHTML = lowestCounties
      .map((region) => {
        return createCarouselProgressBar(
          region.name,
          region.totalScore,
          "carousel-metric-fill--risk"
        );
      })
      .join("");
  }

  const goalPercentElement = document.querySelector("#goalPercent");

  if (goalPercentElement) {
    const countiesThatReachGoal = regionArray.filter((region) => {
      return region.totalScore === 100;
    });

    const goalPercent = Math.round(
      (countiesThatReachGoal.length / regionArray.length) * 100
    );

    goalPercentElement.textContent = `${goalPercent}%`;
  }
}

// Lägger till klick på karusellens pilar och prickar
function setupCarouselControls() {
  const statsPrev = document.querySelector("#statsCarouselPrev");
  const statsNext = document.querySelector("#statsCarouselNext");
  const statsDots = document.querySelectorAll(".stats-carousel-dot");
  
  if (statsPrev) {
    statsPrev.addEventListener("click", () => {
      showStatsSlide(currentStatsSlide - 1);
    });
  }
  if (statsNext) {
    statsNext.addEventListener("click", () => {
      showStatsSlide(currentStatsSlide + 1);
    });
  }
  statsDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showStatsSlide(Number(dot.dataset.slide));
    });
  });
}


//      Startar sidan

// Hämtar all data, bearbetar den och startar renderingen av karta och diagram
function loadRegionData() {
  Promise.all([
    fetch(requestBefolkning).then((response) => response.json()),
    fetch(requestArea).then((response) => response.json()),
    fetch(requestSkord).then((response) => response.json()),
    fetch(requestSlakt).then((response) => response.json()),
    fetch("swedish_regions.geojson").then((response) => response.json())
  ])
    .then(([befolkningData, areaData, skordData, slaktData, geojson]) => {
      printBefolkningChart(befolkningData);
      printAreaChart(areaData);
      printSkordChart(skordData);
      printSlaktChart(slaktData);

      calculateResilience();
      calculateAndDrawMap(geojson);
    })
    .catch((error) => {
      console.error("Något gick fel när datan skulle hämtas:", error);
    });
}

setupCarouselControls();
loadRegionData();