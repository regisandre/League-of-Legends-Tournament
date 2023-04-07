const elementConfigs = {
  titleBar: {
    id: "title-bar",
    hiddenClass: "slide-hide-bottom",
  },
  sponsorPanels: {
    id: "sponsor-panels",
    hiddenClass: "slide-hide-left",
  },
  blueTeamScore: {
    id: "blue-team-score",
    hiddenClass: "slide-hide-top",
  },
  redTeamScore: {
    id: "red-team-score",
    hiddenClass: "slide-hide-top",
  },
  // Add more elements here
};

let isInitialized = false;
let previousStates = {};

function updateElement(element, state, hiddenClass) {
  if (state) {
    element.classList.remove(hiddenClass);
  } else {
    element.classList.add(hiddenClass);
  }
}

function initializeHud(states) {
  Object.entries(elementConfigs).forEach(([key, config]) => {
    const element = document.getElementById(config.id);
    updateElement(element, states[key], config.hiddenClass);
  });

  isInitialized = true;
  previousStates = { ...states };
}

function updateHud() {
  fetch("/update_hud", {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      if (!isInitialized) {
        initializeHud(data);
      }

      const hasStateChanged = Object.keys(data).some((key) => data[key] !== previousStates[key]);

      if (hasStateChanged) {
        Object.entries(elementConfigs).forEach(([key, config]) => {
          const element = document.getElementById(config.id);
          updateElement(element, data[key], config.hiddenClass);
        });

        previousStates = { ...data };
      }
    });
}

setInterval(updateHud, 500);
